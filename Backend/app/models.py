from sqlalchemy import Column, Integer, String, DateTime, func,ForeignKey, DateTime, Float, Enum, Text
from .database import Base
from sqlalchemy.orm import relationship
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

    courses = relationship("Courses", back_populates="teacher")         # courses taught by teacher
    enrollments = relationship("Enrollment", back_populates="student")  # courses student enrolled
    
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
    teacher_Name = Column(String(40), ForeignKey("users.username"))

    teacher = relationship("User", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course",cascade="all, delete-orphan",passive_deletes=True)
    attendances = relationship("Attendance", cascade="all, delete-orphan", passive_deletes=True)
    grades = relationship("Grade", cascade="all, delete-orphan", passive_deletes=True)
    assignments = relationship("Assignment", cascade="all, delete-orphan", passive_deletes=True)

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))

    student = relationship("User", back_populates="enrollments")
    course = relationship("Courses", back_populates="enrollments")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id",ondelete="CASCADE"))
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("Present", "Absent", name="attendance_status"))

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id",ondelete="CASCADE"))
    assignment_grade = Column(Float, nullable=True)
    exam_grade = Column(Float, nullable=True)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id",ondelete="CASCADE"))
    title = Column(String(100))
    file_url = Column(String(200))
    status = Column(Enum("Submitted", "Reviewed", "Evaluated", "Approved", "Rejected", name="assignment_status"))
    comments = Column(Text, nullable=True)
    grade = Column(Float, nullable=True)
    version = Column(Integer, default=1)
    submitted_at = Column(DateTime, default=datetime.utcnow)