import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_USER_NAME = os.getenv("EMAIL_USER_NAME")
