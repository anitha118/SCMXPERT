from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

templates = Jinja2Templates(directory="templates")
unauth_router = APIRouter()

@unauth_router.get("/unauthorized", response_class=HTMLResponse)
async def unauthorized_page(request: Request): 
    return templates.TemplateResponse("unauthorized.html", {"request": request})
