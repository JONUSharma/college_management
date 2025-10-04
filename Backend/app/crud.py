from sqlalchemy.future import select
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from . import models,auth,schemas
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

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
        Course_department=course.Course_department,
        Course_credit=course.Course_credit,
        teacher_Name=course.teacher_Name
    )
    try:
        db.add(new_course)
        await db.commit()
        await db.refresh(new_course)
        return new_course

    except IntegrityError as ie:
        await db.rollback()  # important to await
        # Check if this is a foreign key violation
        if "FOREIGN KEY" in str(ie.orig):
            raise HTTPException(
                status_code=400, 
                detail=f"Teacher '{course.teacher_Name}' does not exist."
            )
        elif "Duplicate entry" in str(ie.orig):
            raise HTTPException(
                status_code=400, 
                detail=f"Course '{course.Course_name}' already exists."
            )
        else:
            raise HTTPException(status_code=400, detail=str(ie.orig))

    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")