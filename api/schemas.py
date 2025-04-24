from pydantic import BaseModel, EmailStr 
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ShipmentCreate(BaseModel):
    shipment_number: str
    route_details: str
    device: str
    po_number: str
    ndc_number: str
    serial_number: str
    container_number: str
    goods_type: str
    delivery_number: str
    expected_date: str
    batch_id: str
    description: Optional[str]

class ShipmentResponse(ShipmentCreate):
    id: str
