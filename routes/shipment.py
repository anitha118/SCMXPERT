from fastapi import APIRouter, HTTPException, Depends, Form, Request, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from api.database import shipments_collection 
from api.auth import get_current_user  

# Create Router & Template Engine
shipment_router = APIRouter()
shipment_router.mount("/statics", StaticFiles(directory="statics"), name="static")
templates = Jinja2Templates(directory="templates")


# GET New Shipment Page
@shipment_router.get("/new_shipment", response_class=HTMLResponse)
async def show_new_shipment_page(request: Request, user: dict = Depends(get_current_user)):
    if not user:
        return RedirectResponse(url="/login", status_code=302)

    return templates.TemplateResponse("new_shipment.html", {"request": request})


# Form class to group form fields and avoid too many parameters
class ShipmentForm:
    def __init__(
        self,
        shipment_number: str = Form(...),
        route_details: str = Form(...),
        device: str = Form(...),
        po_number: str = Form(...),
        ndc_number: str = Form(...),
        serial_number: str = Form(...),
        container_number: str = Form(...),
        goods_type: str = Form(...),
        delivery_number: str = Form(...),
        expected_date: str = Form(...),
        batch_id: str = Form(...),
        description: str = Form(...),
    ):
        self.shipment_number = shipment_number
        self.route_details = route_details
        self.device = device
        self.po_number = po_number
        self.ndc_number = ndc_number
        self.serial_number = serial_number
        self.container_number = container_number
        self.goods_type = goods_type
        self.delivery_number = delivery_number
        self.expected_date = expected_date
        self.batch_id = batch_id
        self.description = description


# POST New Shipment (Create Shipment)
@shipment_router.post("/new_shipment") 
async def create_shipment(
    request: Request,
    form_data: ShipmentForm = Depends(),
    user: dict = Depends(get_current_user),
):
    try:
        if not user:
            return JSONResponse(content={"error": "Unauthorized"}, status_code=401)
        
        if shipments_collection.find_one({"shipment_number": form_data.shipment_number}):
            return JSONResponse(
                content={"detail": "Shipment Number already exists."},
                status_code=409  
            )

        shipment_data = {
            "shipment_number": form_data.shipment_number,
            "route_details": form_data.route_details,
            "device": form_data.device,
            "po_number": form_data.po_number,
            "ndc_number": form_data.ndc_number,
            "serial_number": form_data.serial_number,
            "container_number": form_data.container_number,
            "goods_type": form_data.goods_type,
            "delivery_number": form_data.delivery_number,
            "expected_date": form_data.expected_date,
            "batch_id": form_data.batch_id,
            "description": form_data.description,
            "user_id": user["email"]
        }

        # Try inserting into MongoDB
        result = shipments_collection.insert_one(shipment_data)

        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Database insertion failed")

        return JSONResponse(content={"message": "Shipment created successfully!"}, status_code=201)

    except Exception as e:
        print(f" Error: {e}")  # Logs error in the terminal
        return JSONResponse(content={"error": "Internal Server Error", "detail": str(e)}, status_code=500)
    

# GET My Shipments
@shipment_router.get("/myshipment", response_class=HTMLResponse)
async def my_shipments(request: Request, user: dict = Depends(get_current_user)):
    if not user:
        return RedirectResponse(url="/login", status_code=302)

    shipments = list(shipments_collection.find({"user_id": user["email"]}, {"_id": 0}))
    
    return templates.TemplateResponse(
        "myshipment.html",
        {"request": request, "shipments": shipments}
    )
