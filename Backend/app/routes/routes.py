from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..logs.logger_config import get_logger
from .. import database,auth,models,crud,schemas
from ..sendOtp import send_mail
import random
from sqlalchemy.future import select
from datetime import datetime, timedelta

app = APIRouter()
logger = get_logger("main")

# By /register user can signup/register

@app.post("/register", response_model=schemas.UserPublic)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    try:
        logger.info(f"Register request for username={user.username}, email={user.email}")

        existing = await crud.get_user_by_username(db, user.username)
        if existing:
            logger.warning(f"Registration failed: username={user.username} already exists")
            raise HTTPException(status_code=400, detail="user already exist")

        new_user = await crud.create_user(db, user.username, user.email, user.password)
        await db.refresh(new_user)
        logger.info(f"User registered successfully: {user.username}")
        return new_user

    except HTTPException as http_ex:
        # Already a handled exception (validation, duplicate user, etc.)
        logger.error(f"HTTPException during registration: {http_ex.detail}")
        raise http_ex

    except Exception as e:
        # Unexpected error (DB issues, etc.)
        logger.exception(f"Unexpected error during registration for username={user.username}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# By using /login user can login
@app.post("/login", response_model=schemas.Token)
async def login(

    form_data: schemas.UserLogin,
    db: AsyncSession = Depends(database.get_db)
):
    try:
        logger.info(f"Login attempt for username = {form_data.username}")

        user = await crud.get_user_by_username(db, form_data.username)
        if not user or not auth.verify_password(form_data.password, user.hashed_password):
            logger.warning(f"Login failed for username = {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        logger.info(f"User login successful: {form_data.username}")
        token = auth.create_access_token({"sub": user.username})

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        logger.error(f"Unexpected error during login for username={form_data.username}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
    
    # user can request for otp
@app.post("/forget-password")
async def forget_password(data: schemas.ForgetPasswordRequest, db :AsyncSession = Depends(database.get_db)):
        logger.info(f"Password Forget request with email = {data.email}")
        user = await db.execute(select(models.User).where(models.User.email == data.email))
        user = user.scalars().first()
        if not user:
                logger.warning(f"Password reset failed user not found with email = {data.email}")
                raise HTTPException(status_code= 404, detail= "User not found")
        
        otp= str(random.randint(100000,999999))
        user.otp = otp
        user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        db.add(user)
        await db.commit()

         # send OTP via email
        subject = "Password Reset OTP"
        body = f"Your OTP for password reset is: {otp}. It is valid for 10 minutes."

        try:
         send_mail(user.email, subject, body)
         logger.info(f"OTP send to email = {data.email}")
        except Exception as e:
           logger.info(f"Failed to send OTP to email = {data.email}")
           raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

        return {"message": "OTP sent successfully to your email"}

#send otp via email     
@app.post("/reset-password")
async def reset_password(data: schemas.ResetPasswordRequest, db: AsyncSession = Depends(database.get_db)):
        logger.info(f"Password reset request with email = {data.email}")
        user = await db.execute(select(models.User).where(models.User.email == data.email))
        user = user.scalars().first()
        if not user:
                logger.info(f"Error in sending OTP because user not found with email = {data.email}")
                raise HTTPException(status_code=404, detail="User not found")
    
        if user.otp != data.otp or datetime.utcnow() > user.otp_expiry:
                logger.info(f"Invalid/expired OTP for email = {data.email}")
                raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        # Hash new password
        hashed_pw = auth.hash_password(data.new_password)
        user.hashed_password = hashed_pw
        user.otp = None
        user.otp_expiry = None
        db.add(user)
        await db.commit()
        logger.info(f"Password reset successfullt with email = {data.email}")
        return {"message": "Password reset successful"}

# Fetch all register user
@app.get("/users/all")
async def get_all_users(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    logger.info(f"Admin = {current_user.username} requested  all user")
    if current_user.role != "admin":
        logger.warning(f"Unauthorized access attempt by = {current_user.username}")
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(models.User))
    users = result.scalars().all()
    logger.info(f"Admin = {current_user.username        } get all user list")
    return users


# Delete user by admin
@app.delete("/user/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    logger.info(f"Delete user with id={user_id} by {current_user.username}")

    # Get user
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()

    if not user:
        logger.warning(f"User {current_user.username} tried to delete non-existing user {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.id != user_id and current_user.role != "admin":
        logger.warning(f"User {current_user.username} not authorized to delete user {user_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    #  Archive user before delete
    archived_user = models.UserArchive(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
        deleted_at=datetime.utcnow()
    )
    db.add(archived_user)

    # Delete from main table
    await db.delete(user)
    await db.commit()

    logger.info(f"User {user_id} deleted and archived by {current_user.username}")
    return {"message": "User deleted successfully"}


# create new Course
@app.post("/create-course", response_model=schemas.COursePublic)
async def create_course(course : schemas.CourseCreate, db :AsyncSession = Depends(database.get_db)):
     try: 
          logger.info(f"Creating a  new course = {course.Course_name}")
          new_courses =await crud.create_course(db,course)
          logger.info(f"Course created successfully with course name : {course.Course_name}")
          return new_courses         
     except Exception as e:
          logger.exception(f"Error creating course : {str(e)}")
          raise HTTPException(status_code=500, detail="Internal server error")     

