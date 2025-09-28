from pydantic import BaseModel, EmailStr 
from datetime import datetime
from typing import Optional, List

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

class UserUpdate(BaseModel):
    username: str
    role: str

# Request model for creating courses
class CourseCreate(BaseModel):
    Course_name: str
    Course_desc: str
    Course_duration : str
    Course_department : str
    Course_credit : str
    teacher_id: int


# class model for sending response of course info
class COursePublic(BaseModel):
    id : int
    Course_name: str
    Course_desc: str | None = None
    Course_duration : str
    Course_department : str
    Course_credit : str
    teacher_id: int
    created_at: datetime
    updated_at: datetime
class UpdateCourse(BaseModel):
    Course_name: str
    Course_desc: str | None = None
    Course_duration : str
    Course_department : str
    Course_credit : str

class CourseResponse(BaseModel):
    id: int
    Course_name: str
    Course_desc: Optional[str]
    Course_credit: Optional[str]
    Course_duration: Optional[str]
    Course_department: Optional[str]
    teacher_id: Optional[int]
# create assendance rules
class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    status: str  # "Present" or "Absent"

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    status: str
    date: datetime

class BulkAttendanceCreate(BaseModel):
    attendances: List[AttendanceCreate]


# Grade rules
class GradeCreate(BaseModel):
    student_id: int
    course_id: int
    assignment_grade: Optional[float] = None
    exam_grade: Optional[float] = None

class GradeResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    assignment_grade: Optional[float]
    exam_grade: Optional[float]

# Enrollment for course
class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int

class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    
# create attendance rules
class AssignmentCreate(BaseModel):
    student_id: int
    course_id: int
    title: str

class AssignmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    title: str
    file_url: str
    status: str
    grade: Optional[float]
    version: int
    submitted_at: datetime

    class Config:
        from_attributes  = True