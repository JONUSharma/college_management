from sqlalchemy import Column, Integer, String,DateTime
from datetime import datetime, timedelta
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(40), unique=True,index=True , nullable=False)
    email = Column(String(40),unique= True, index=True, nullable=True)
    hashed_password = Column(String(60),nullable=False)
    role = Column(String(30),default= "student")
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True) 