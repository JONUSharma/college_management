from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGROITHM = os.getenv("ALGROITHM")
ACCES_TOKEN_EXPIRE_MINUTES =int(os.getenv("ACCES_TOKEN_EXPIRE_MINUTES"))

pwd_context =   CryptContext(schemes = ["bcrypt"], deprecated = "auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def get_password_hashed(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta : timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCES_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp" :expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGROITHM)