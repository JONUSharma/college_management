import logging
from logging.handlers import RotatingFileHandler
import os

# Ensure logs folder exists
if not os.path.exists("logs"):
    os.makedirs("logs")

# File handler (rotating logs)
file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=50 * 1024 * 1024,  # 50 MB
    backupCount=10,
    encoding="utf-8"
)

# Formatter
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
file_handler.setFormatter(formatter)

# Root logger setup (no console handler, only file)
logging.basicConfig(
    level=logging.INFO,
    handlers=[file_handler]
)

# Suppress SQLAlchemy noisy logs (only errors will be logged)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("passlib").setLevel(logging.ERROR)  # optional: hide bcrypt warning

def get_logger(name: str):
    return logging.getLogger(name)
