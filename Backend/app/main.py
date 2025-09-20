from fastapi import FastAPI , Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import database, models, schemas, crud, auth
from .sendOtp import send_mail
from datetime import datetime, timedelta
import random
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://127.0.0.1:5173" ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
        async with database.engine.begin() as conn:
                await conn.run_sync(models.Base.metadata.create_all)

@app.post("/register", response_model=schemas.UserPublic)
async def register(user: schemas.UserCreate, db:AsyncSession = Depends(database.get_db)):
        existing = await crud.get_user_by_username(db,user.username)
        if existing:
                raise HTTPException(status_code=400, detail="user already exist")
        new_user = await crud.create_user(db,user.username, user.email,user.password)
        return new_user

@app.post("/login", response_model=schemas.Token)
async def login(form_data : schemas.UserLogin, db:AsyncSession = Depends(database.get_db)):
        user = await crud.get_user_by_username(db,form_data.username)
        if not user or not auth.verify_password(form_data.password, user.hashed_password):
                raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail= "Invalid credentials")
        
        token = auth.create_access_token({"sub": user.username})
        return {"access_token": token,"token_type" : "bearer", "user":user }


# user can request for otp
@app.post("/forget-password")
async def forget_password(data: schemas.ForgetPasswordRequest, db :AsyncSession = Depends(database.get_db)):
        user = await db.execute(select(models.User).where(models.User.email == data.email))
        user = user.scalars().first()
        if not user:
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
        except Exception as e:
           raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

        return {"message": "OTP sent successfully to your email"}


#send otp via email
@app.post("/reset-password")
async def reset_password(data: schemas.ResetPasswordRequest, db: AsyncSession = Depends(database.get_db)):
        user = await db.execute(select(models.User).where(models.User.email == data.email))
        user = user.scalars().first()
        if not user:
                raise HTTPException(status_code=404, detail="User not found")
    
        if user.otp != data.otp or datetime.utcnow() > user.otp_expiry:
                raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        # Hash new password
        hashed_pw = auth.hash_password(data.new_password)
        user.hashed_password = hashed_pw
        user.otp = None
        user.otp_expiry = None
        db.add(user)
        await db.commit()
    
        return {"message": "Password reset successful"}

