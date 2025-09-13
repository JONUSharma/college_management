from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import models,auth

async def create_user(db: AsyncSession, username: str, email:str , password: str, role : str = "student"):
    hashed_password = auth.get_password_hashed(password)
    user = models.User(username= username,email= email, hashed_password = hashed_password, role= role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(models.User).where(models.User.username == username))
    return result.scalar_one_or_none()