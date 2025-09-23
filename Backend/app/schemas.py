from pydantic import BaseModel, EmailStr 
from datetime import datetime
# For creating a new user
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


# For login request
class UserLogin(BaseModel):
    username: str
    password: str

# Safe user schema (response only, no password)
class UserPublic(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

# Token response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic   # include user details in login response

#Forget Password Request
class ForgetPasswordRequest(BaseModel):
    email : EmailStr

#Resert password request
class ResetPasswordRequest(BaseModel):
    email:EmailStr
    otp:str
    new_password : str


#Read user (Response model)
class UserRead(BaseModel):
    id :int
    username:str
    role : str

# Request model for creating courses
class CourseCreate(BaseModel):
    Course_name: str
    Course_desc: str
    Course_duration : str
    Course_credit : str

# class model for sending response of course info
class COursePublic(BaseModel):
    id : int
    Course_name: str
    Course_desc: str | None = None
    Course_duration : str
    Course_credit : str
    created_at: datetime
    updated_at: datetime


    class Config:
        from_attributes  = True
