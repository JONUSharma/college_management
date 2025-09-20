from pydantic import BaseModel, EmailStr 

# For creating a new user
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


# For login request
class UserLogin(BaseModel):
    username: str
    password: str


# Token response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserPublic"   # include user details in login response

#Forget Password Request
class ForgetPasswordRequest(BaseModel):
    email : EmailStr

class ResetPasswordRequest(BaseModel):
    email:EmailStr
    otp:str
    new_password : str

# Safe user schema (response only, no password)
class UserPublic(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True
