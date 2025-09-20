import aiosmtplib
import smtplib, ssl
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER_NAME = os.getenv("EMAIL_USER_NAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_mail(to_email: str, subject: str, body: str):
    message = f"Subject: {subject}\n\n{body}"

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_USER_NAME, EMAIL_PASSWORD)
            server.sendmail(EMAIL_USER_NAME, to_email, message)
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        raise