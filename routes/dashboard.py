from fastapi import APIRouter, Request, Depends, Form 
from fastapi.templating import Jinja2Templates 
from fastapi.responses import HTMLResponse, RedirectResponse 
from api.auth import get_current_user  

dashboard_router = APIRouter()
templates = Jinja2Templates(directory="templates")

@dashboard_router.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, user: dict = Depends(get_current_user)): 
    if not user:
        return RedirectResponse(url="/auth/login", status_code=302)  # Redirect to login if not authenticated
      
    return templates.TemplateResponse("dashboard.html", {"request": request, "user": user})





