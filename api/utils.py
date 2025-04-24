# from passlib.context import CryptContext
# import jwt
# import os
# from dotenv import load_dotenv
# from datetime import datetime, timedelta, timezone

# # Load environment variables
# load_dotenv()

# SECRET_KEY = os.getenv("SECRET_KEY", "secretKey@2025")
# ALGORITHM = "HS256"

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     """Hashes a password using bcrypt"""
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verifies a password against its hashed version"""
#     return pwd_context.verify(plain_password, hashed_password)

# def create_jwt_token(data: dict, expires_delta: timedelta = timedelta(hours=1)) -> str:
#     """Creates a JWT token with expiration"""
#     to_encode = data.copy()
#     expire = datetime.now(timezone.utc) + expires_delta  # Fixed timezone issue
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)