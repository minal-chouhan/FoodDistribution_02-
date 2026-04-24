from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid, os

app = FastAPI(title="No Food Left API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory store ──
food_db: List[dict] = []
stats_db = {"total_meals_donated": 847, "total_kg_saved": 423.0, "co2_avoided": 846.0}

class FoodListing(BaseModel):
    food_name: str
    donor_name: str
    food_type: str = "veg"
    quantity: int
    unit: str = "plates"
    zone: str
    address: str
    expiry_level: str = "fresh"
    cooked_at: Optional[str] = None
    best_before: Optional[str] = None
    allergens: List[str] = []
    restrictions: List[str] = []
    description: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    pickup_notes: Optional[str] = None

class PickupAccept(BaseModel):
    ngo_name: str
    volunteer_name: Optional[str] = None

SEED = [
    {"food_name":"Dal Makhani + Roti","donor_name":"Spice Garden","food_type":"veg","quantity":18,"unit":"plates","zone":"Vijay Nagar","address":"12, Vijay Nagar, Indore","expiry_level":"urgent","allergens":["Dairy","Gluten"],"restrictions":["Diabetics"],"description":"Full dal makhani with 2 rotis per plate.","status":"available","accepted_by":None},
    {"food_name":"Veg Biryani","donor_name":"Hotel Shreyas","food_type":"veg","quantity":32,"unit":"plates","zone":"Palasia","address":"45, Palasia Square, Indore","expiry_level":"fresh","allergens":[],"restrictions":[],"description":"Mixed veg biryani with raita.","status":"available","accepted_by":None},
    {"food_name":"Bread + Pastries","donor_name":"Bakers Point","food_type":"veg","quantity":45,"unit":"pieces","zone":"MG Road","address":"7, MG Road, Indore","expiry_level":"moderate","allergens":["Gluten","Dairy","Eggs"],"restrictions":["Diabetics","Infants <2 yrs"],"description":"Assorted bread and pastries.","status":"claimed","accepted_by":"Roti Bank Indore"},
    {"food_name":"Chicken Biryani","donor_name":"Zaiqa Restaurant","food_type":"nonveg","quantity":24,"unit":"plates","zone":"Race Course","address":"22, Race Course Rd, Indore","expiry_level":"urgent","allergens":[],"restrictions":["Jain (onion/garlic)"],"description":"Dum chicken biryani with salan.","status":"available","accepted_by":None},
    {"food_name":"Sambar + Idli","donor_name":"Udupi Cafe","food_type":"vegan","quantity":20,"unit":"plates","zone":"Scheme 54","address":"3, Scheme 54, Indore","expiry_level":"moderate","allergens":[],"restrictions":[],"description":"South Indian breakfast combo.","status":"available","accepted_by":None},
]
for s in SEED:
    food_db.append({**s, "id": str(uuid.uuid4()), "created_at": datetime.now().isoformat()})

# ── API Routes ──
@app.get("/api/food")
def get_food(zone: Optional[str]=None, food_type: Optional[str]=None,
             expiry_level: Optional[str]=None, status: Optional[str]=None):
    result = food_db.copy()
    if zone:         result = [f for f in result if f["zone"] == zone]
    if food_type:    result = [f for f in result if f["food_type"] == food_type]
    if expiry_level: result = [f for f in result if f["expiry_level"] == expiry_level]
    if status:       result = [f for f in result if f["status"] == status]
    return {"listings": result, "count": len(result)}

@app.get("/api/food/{food_id}")
def get_food_detail(food_id: str):
    item = next((f for f in food_db if f["id"] == food_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Food listing not found")
    return item

@app.post("/api/add-food", status_code=201)
def add_food(listing: FoodListing):
    item = listing.dict()
    item["id"]          = str(uuid.uuid4())
    item["status"]      = "available"
    item["created_at"]  = datetime.now().isoformat()
    item["accepted_by"] = None
    food_db.append(item)
    stats_db["total_meals_donated"] += listing.quantity
    stats_db["total_kg_saved"]      += round(listing.quantity * 0.35, 1)
    stats_db["co2_avoided"]         += round(listing.quantity * 0.70, 1)
    return {"message": "Listed!", "id": item["id"], "item": item}

@app.patch("/api/food/{food_id}/accept")
def accept_pickup(food_id: str, body: PickupAccept):
    item = next((f for f in food_db if f["id"] == food_id), None)
    if not item:              raise HTTPException(404, "Not found")
    if item["status"] == "claimed": raise HTTPException(400, "Already claimed")
    item["status"]      = "claimed"
    item["accepted_by"] = body.ngo_name
    item["accepted_at"] = datetime.now().isoformat()
    return {"message": "Accepted!", "item": item}

@app.delete("/api/food/{food_id}")
def delete_food(food_id: str):
    global food_db
    if not any(f["id"] == food_id for f in food_db): raise HTTPException(404, "Not found")
    food_db = [f for f in food_db if f["id"] != food_id]
    return {"message": "Deleted"}

@app.get("/api/stats")
def get_stats():
    active  = len([f for f in food_db if f["status"] == "available"])
    urgent  = len([f for f in food_db if f["status"] == "available" and f["expiry_level"] == "urgent"])
    plates  = sum(f["quantity"] for f in food_db if f["status"] == "available")
    claimed = len([f for f in food_db if f["status"] == "claimed"])
    return {**stats_db, "active_listings": active, "urgent_listings": urgent,
            "plates_available": plates, "claimed_listings": claimed}

PATTERNS = {
    "Monday":    {"high":["Idli","Poha","Dal"],         "low":["Biryani","Paneer Tikka"]},
    "Tuesday":   {"high":["Dal","Roti","Rice"],          "low":["Fried items","Korma"]},
    "Wednesday": {"high":["Rice","Sambhar","Curry"],     "low":["Paneer","Shahi dishes"]},
    "Thursday":  {"high":["Biryani","Pulao"],            "low":["Idli","Poha"]},
    "Friday":    {"high":["Dal Makhani","Biryani"],      "low":["Paneer Tikka","Kadai Sabzi"]},
    "Saturday":  {"high":["Biryani","Kebab","Tikka"],    "low":["Plain Dal","Simple Roti"]},
    "Sunday":    {"high":["Special Thali","Biryani"],    "low":["Light snacks","Plain items"]},
}

@app.get("/api/predict/{day}")
def predict(day: str):
    p = PATTERNS.get(day, PATTERNS["Friday"])
    waste = [f for f in food_db if f["status"] == "available"
             and any(low.lower() in f["food_name"].lower() for low in p["low"])]
    return {
        "day": day, "high_demand": p["high"], "low_demand": p["low"],
        "reduce_items": [{"food":f["food_name"],"donor":f["donor_name"],
                          "quantity":f["quantity"],"reduce_by":"30%"} for f in waste[:3]],
        "tip": f"On {day}s — make more {', '.join(p['high'][:2])}. Cut back on {', '.join(p['low'][:2])}."
    }

# ── Serve React frontend (must be LAST) ──
STATIC = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        return FileResponse(os.path.join(STATIC, "index.html"))
