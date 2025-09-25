from sqlalchemy import Column, Integer, String, DateTime, func
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(40), unique=True,index=True , nullable=False)
    email = Column(String(40),unique= True, index=True, nullable=True)
    hashed_password = Column(String(60),nullable=False)
    role = Column(String(30),default= "student")
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_onupdate=func.now(),server_default=func.now())


class UserArchive(Base):
    __tablename__ = "users_archive"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100))
    email = Column(String(100))
    role = Column(String(50))
    created_at = Column(DateTime)
    deleted_at = Column(DateTime, default=datetime.utcnow)


class Courses(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    Course_name = Column(String(50), nullable=False)
    Course_desc = Column(String(300))
    Course_credit = Column(String(40))
    Course_duration = Column(String(40))
    Course_department = Column(String(40))
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())