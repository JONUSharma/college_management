from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import models,auth,schemas

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

async def create_course(db: AsyncSession, course: schemas.CourseCreate):
    new_course = models.Courses(
        Course_name=course.Course_name,
        Course_desc=course.Course_desc,
        Course_duration=course.Course_duration,
        Course_credit=course.Course_credit
    )
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)
    return new_course