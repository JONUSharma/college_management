from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email : str
    password: str

class UserLogin(BaseModel):
    username : str
    password: str

class Token(BaseModel):
    access_token: str
    token_type : str

class UserResponse(BaseModel):
    id: int
    username: str
    password: str
    email : str
    role : str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    
class config:
    orm_mode = True
