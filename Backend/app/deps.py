from fastapi import Depends, HTTPException, status
from jose import JWTError,jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .database import get_db
from .models import User
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGROITHM = os.getenv("ALGROITHM")

async def get_current_user(token :str, db:AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGROITHM)
        username : str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="invalid credenttials ")
    except JWTError:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail="invalid Token") 
    
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


