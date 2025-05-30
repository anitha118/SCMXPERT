from fastapi import APIRouter, HTTPException, Depends, Form, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from api.database import devices_collection
from api.auth import get_current_user
from datetime import datetime

device_router = APIRouter()

# Static files and templates
device_router.mount("/statics", StaticFiles(directory="statics"), name="static")
templates = Jinja2Templates(directory="templates")

# ✅ Admin-only: Render the Device Data Page
@device_router.get("/devicedata")
async def add_device_page(request: Request, user: dict = Depends(get_current_user)):
    if not user:
        return RedirectResponse(url="/login", status_code=302)

    if user.get("role") != "admin":
        return RedirectResponse(url="/unauthorized", status_code=302)

    return templates.TemplateResponse("devicedata.html", {"request": request, "devices": []})


# ✅ Admin-only: Fetch device data for selected device ID
@device_router.get("/device")
async def get_device_data(request: Request, device_id: str = None, user: dict = Depends(get_current_user)):
    if not user:
        return RedirectResponse(url="/login", status_code=302)

    if user.get("role") != "admin":
        return RedirectResponse(url="/unauthorized", status_code=302)

    devices = []
    if device_id:
        device = devices_collection.find({"Device_ID": int(device_id)}, {"_id": 0})
        devices = list(device)  # Convert cursor to list

    return templates.TemplateResponse(
        "devicedata.html",
        {"request": request, "devices": devices, "selected_device_id": device_id}
    )
