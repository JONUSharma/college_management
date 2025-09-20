import smtplib, ssl

EMAIL_USER_NAME = "jonusharma4440@gmail.com"
EMAIL_PASSWORD = "tfnthjjxhwjkicpa"

context = ssl.create_default_context()
try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(EMAIL_USER_NAME, EMAIL_PASSWORD)
        server.sendmail(
            EMAIL_USER_NAME,
            "random98182@gmail.com",
            "Subject: Test Email\n\nHello from Python!"
        )
    print("✅ Email sent!")
except Exception as e:
    print("❌ Failed:", e)
