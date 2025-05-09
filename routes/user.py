from fastapi import APIRouter, HTTPException, Request, Form, Depends,status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, Response 
from fastapi.staticfiles import StaticFiles
from api.database import users_collection 
from api.auth import hash_password, verify_password, create_jwt_token 

user_router = APIRouter() 
user_router.mount("/statics", StaticFiles(directory="statics"), name="static")

templates = Jinja2Templates(directory="templates")

@user_router.get("/")
async def get_user(request: Request):
    return templates.TemplateResponse("homepage.html", {"request": request})

@user_router.get("/login")
async def get_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Signup Page
@user_router.get("/signup")
def show_signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

# Signup Logic
@user_router.post("/signup")
async def signup(
    request: Request,
    username: str = Form(),
    email: str = Form(),
    password: str = Form(),
    confirm_password: str = Form(),
):

    # Validate passwords match
    if password != confirm_password:
        return templates.TemplateResponse(
            "signup.html",
            {"request": request, "error": "Passwords do not match"},
        )

    # Check if email already exists
    if users_collection.find_one({"email": email}):
        print("user exists")
        return templates.TemplateResponse(
            "signup.html",
            {"request": request, "error": "Email already exists"},
        )

    # Hash password and store user
    hashed_password = hash_password(password)
    user_data = {
    "username": username,
    "email": email,
    "password": hashed_password,
    "role": "user"  
    }

    users_collection.insert_one(user_data)
    
    return templates.TemplateResponse("signup.html", {"request": request, "success": "Signup successful"})

# Login Page
@user_router.post("/login")
def login(request: Request, email: str = Form(), password: str = Form()):
    user = users_collection.find_one({"email": email}, {"_id": 0})
    print("User Found:", user) 

    try:
        if user and verify_password(password, user["password"]):
           token = create_jwt_token(
               data={"sub": user["email"]},  
               role=user["role"]
               )
           print("Generated Token:", token) 
           
           response = RedirectResponse(url="/dashboard", status_code=303)
           response.set_cookie(
                key="access_token",
                value=token,
                httponly=True,
                samesite="Lax",
                max_age=3600,
                secure=False,  
            )
           return response
        
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "error": "Invalid credentials"},
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@user_router.get("/logout")
def logout():
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie("access_token", path="/") 
    return response