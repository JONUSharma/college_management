from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List
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
async def login( form_data: schemas.UserLogin,
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

        token = auth.create_access_token({"sub": user.username})
        logger.info(f"User login successful: {form_data.username}")

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }
    except HTTPException:
        # ✅ don’t catch your own intentional HTTP errors
        raise
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


#Fetch current user
@app.get("/users/me", response_model=schemas.UserPublic)
async def read_current_user(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user

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


#update user role by admin
@app.put("/users/{user_id}", response_model=schemas.UserRead)
async def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    try:
         # ✅ Only admin can update
        if current_user.role != "admin" and current_user.id == user_id:
         logger.info(f"{current_user.username} is not authorized to update users")
         raise HTTPException(status_code=403, detail="Not authorized to update users")
         # ✅ Fetch user
        result = await db.execute(select(models.User).where(models.User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            logger.warning("User not found")
            raise HTTPException(status_code=404, detail="User not found")
        # ✅ Update fields if provided
        if user_data.username:
             user.username = user_data.username
        if user_data.role:
            user.role = user_data.role

        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"user detail update successfully {user}")
        return user
    except Exception as e :
        logger.exception("Error in updating user detail")
        raise HTTPException(status_code=500, detail=str(e))

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

# USer try to fetch all courses
@app.get("/fetch-courses")
async def fetch_courses(db : AsyncSession = Depends(database.get_db)):
     try:
          logger.info("User try to fetch all courses")
          result = await db.execute(select(models.Courses))
          course = result.scalars().all()
          if not course:
               logger.warning("No course is availabe")
               raise HTTPException(status_code=403, detail="No course found")
          logger.info(f"ALl courses found successfully: {course}")
          return course
     except Exception as e:
          logger.exception("Error in fetching courses")
          raise HTTPException(status_code=500, detail="Error in finding courses")
          
# delete courses by admin
@app.delete("/delete-course/{course_id}")
async def delete_course(course_id : int, db : AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
     try :
          logger.info(f"User {current_user.username} try to delete course by id : {course_id}")
          # check user role
          if current_user.role != "admin":
               logger.warning(f"{current_user.username} are not authorized to delete the course with id: {course_id}")
               raise HTTPException(status_code=403, detail=f"{current_user.username} are not authorized to delete the course")

          course = await db.execute(select(models.Courses).filter(models.Courses.id == course_id))
          course = course.scalar_one_or_none()
          if not course:
               logger.exception(f"NO course found with id : {course_id}")
               raise HTTPException(status_code=404, detail=f"No course found with id :{course_id}" )
          await db.delete(course)
          await db.commit()
          logger.info(f"course deleted by {current_user.username} with course id : {course_id}")
          return {"message" : f"Course deleted by {current_user.username} with course id :{course_id}"}
     except Exception as e:
          logger.exception("Error in deleting course")
          raise HTTPException(status_code=500, detail="Error in deleting course")

# admin can update the course detail
@app.put("/update-course/{course_id}")
async def update_course(
    course_id: int,
    course_update: schemas.UpdateCourse,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    try:
        # Check user role
        if current_user.role != "admin":
            logger.info(f"{current_user.username} are not authorized to update courses")
            raise HTTPException(status_code=403, detail="You are not authorized to update courses")

        # Fetch existing course
        result = await db.execute(select(models.Courses).filter(models.Courses.id == course_id))
        course = result.scalar_one_or_none()

        if not course:
            logger.warning(f"No course found with id :{course_id}")
            raise HTTPException(status_code=404, detail=f"No course found with id: {course_id}")

        # Update only provided fields
        update_data = course_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(course, key, value)

        # Commit changes
        await db.commit()
        await db.refresh(course)
        logger.info(f"Admin {current_user.username} update the course with id : {course_id}")
        return {"message": f"Course {course_id} updated successfully", "course": course}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating course: {str(e)}")


# mark attendance
@app.post("/attendance", response_model=schemas.AttendanceResponse)
async def mark_attendance(
    attendance_data: schemas.AttendanceCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    
):
    try:
        if current_user["role"] not in ["teacher", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        attendance = models.Attendance(
            student_id=attendance_data.student_id,
            course_id=attendance_data.course_id,
            status=attendance_data.status,
            date=datetime.utcnow()
        )
        db.add(attendance)
        await db.commit()
        await db.refresh(attendance)
        logger.info(f"Marked attendance for student_id={attendance_data.student_id}")
        return attendance
    except Exception as e:
        logger.error(f"Error marking attendance: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/attendance/{student_id}", response_model=list[schemas.AttendanceResponse])
async def get_attendance(student_id: int, db: AsyncSession = Depends(database.get_db)):
    try:
        result = await db.execute(
            select(models.Attendance).where(models.Attendance.student_id == student_id)
        )
        data = result.scalars().all()
        return data
    except Exception as e:
        logger.error(f"Error fetching attendance for student_id={student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/attendance/bulk")
async def mark_bulk_attendance(
    data: schemas.BulkAttendanceCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),

):
    try:
        if current_user["role"] not in ["teacher", "admin"]:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        inserted_attendances = []

        for item in data.attendances:
            # Check student exists
            student = await db.get(models.User, item.student_id)
            if not student:
                raise HTTPException(status_code=404, detail=f"Student {item.student_id} not found")
            
            # Check course exists
            course = await db.get(models.Courses, item.course_id)
            if not course:
                raise HTTPException(status_code=404, detail=f"Course {item.course_id} not found")

            attendance = models.Attendance(
                student_id=item.student_id,
                course_id=item.course_id,
                status=item.status,
                date=datetime.utcnow()
            )
            db.add(attendance)
            inserted_attendances.append(attendance)

        await db.commit()
        for att in inserted_attendances:
            await db.refresh(att)

        logger.info(f"Marked bulk attendance for {len(inserted_attendances)} students")
        return {"message": f"Attendance marked for {len(inserted_attendances)} students", "data": inserted_attendances}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking bulk attendance: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Student enroll self
@app.post("/enroll", response_model=schemas.EnrollmentResponse)
async def enroll_course(enroll: schemas.EnrollmentCreate, db: AsyncSession = Depends(database.get_db), current_user:models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["student", "admin"]:
        logger.warning("User not authorized to enroll for course")
        raise HTTPException(status_code=403, detail="Not authorized")
    
    enrollment = models.Enrollment(student_id=enroll.student_id, course_id=enroll.course_id)
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

# Get students of a course (Teacher/Admin/HOD)
@app.get("/course/{course_id}/students")
async def get_course_students(course_id: int, db: AsyncSession = Depends(database.get_db), current_user:models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["teacher","admin","hod"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(models.Enrollment)
        .options(selectinload(models.Enrollment.student))  # ✅ eagerly load student
        .where(models.Enrollment.course_id==course_id)
    )
    enrollments = result.scalars().all()
    
    students_list = [{"id": e.student.id, "name": e.student.username} for e in enrollments]
    return students_list   