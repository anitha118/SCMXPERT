from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi import Response, Request
from routes.user import user_router
from routes.dashboard import dashboard_router
from routes.shipment import shipment_router
from routes.device import device_router
from routes.unauthorized import unauth_router
from api.auth import get_current_user
from pymongo import MongoClient
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/statics", StaticFiles(directory="statics"), name="statics")

# MongoDB connection
client = MongoClient("mongodb+srv://anitha:Ch%40ni18eddy@cluster0.b86pq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["data"]
col = db["scm"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router)
app.include_router(dashboard_router)
app.include_router(shipment_router)
app.include_router(device_router)
app.include_router(unauth_router)




