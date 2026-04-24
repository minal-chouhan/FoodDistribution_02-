# No Food Left - MongoDB Setup & Run Guide

## Installation

### 1. Install MongoDB Community Edition

#### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Select "Install MongoDB as a Service"
4. MongoDB will run on `mongodb://localhost:27017`

**Verify installation:**
```powershell
mongod --version
mongo --version
```

#### macOS (Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

---

### 2. Install Python Dependencies

Navigate to backend folder:
```bash
cd backend
pip install -r requirements.txt
```

**What's installed:**
- `pymongo==4.6.0` — MongoDB Python driver
- `motor==3.3.2` — Async MongoDB support (optional for future)

---

### 3. Configure Environment

Create `.env` file in the backend folder:
```bash
MONGO_URL=mongodb://localhost:27017
```

Or use MongoDB Atlas (cloud):
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

## Database Schema

### Collections

#### `food_listings`
Stores all food donations with the following fields:

```javascript
{
  "_id": ObjectId,                    // Auto-generated MongoDB ID
  "food_name": "Dal Makhani + Roti",
  "donor_name": "Spice Garden",
  "food_type": "veg",                 // veg, nonveg, vegan
  "quantity": 18,                     // Number of plates
  "unit": "plates",                   // plates, pieces, kg, liters
  "zone": "Vijay Nagar",
  "address": "12, Vijay Nagar, Indore",
  "expiry_level": "urgent",           // fresh, moderate, urgent
  "status": "available",              // available, claimed
  "accepted_by": null,                // NGO name if claimed
  "created_at": "2026-04-24T10:30:00",
  "accepted_at": null,
  "description": "Full dal makhani with 2 rotis per plate.",
  "allergens": ["Dairy", "Gluten"],
  "restrictions": ["Diabetics"],
  "contact_name": null,
  "contact_phone": null,
  "pickup_notes": null
}
```

#### `stats` (Global Stats)
Tracks aggregate platform data:

```javascript
{
  "_id": "global",
  "total_meals_donated": 847,
  "total_kg_saved": 423.0,
  "co2_avoided": 846.0
}
```

#### `donors` (Donor Profile - optional for future)
For storing donor-specific data and preferences.

---

## Running the Application

### Start MongoDB
```powershell
# Windows - if installed as service, it auto-starts
mongod

# Or check if running:
mongo --eval "db.adminCommand('ping')"
```

### Start Backend
```bash
cd backend
python -m uvicorn main:app --reload
```

**Output:**
```
✓ MongoDB connected successfully
✓ Seeded 5 food listings
✓ Initialized global stats
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

**Output:**
```
  ➜  Local:   http://localhost:5173/
```

---

## Verifying MongoDB Data

### Connect to MongoDB Shell
```bash
mongo
```

### View Database
```javascript
use nofoodleft
show collections
```

### View Food Listings
```javascript
db.food_listings.find().pretty()
```

### View Stats
```javascript
db.stats.findOne({ "_id": "global" })
```

### Query by Donor
```javascript
db.food_listings.find({ "donor_name": "Spice Garden" })
```

### Query by Status
```javascript
db.food_listings.find({ "status": "available" })
```

### Count Documents
```javascript
db.food_listings.countDocuments()
db.food_listings.countDocuments({ "status": "claimed" })
```

---

## Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection failed: ...
```

**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check MONGO_URL in `.env` file
3. For MongoDB Atlas, verify connection string and IP whitelist

### No Data After Seeding
```bash
# Check if seed data was inserted:
mongo nofoodleft --eval "db.food_listings.count()"
```

### API Returns Wrong IDs
The MongoDB `_id` field is a BSON ObjectId. Make sure the frontend treats it as a string:
```javascript
item["id"] = str(item["_id"])  // Backend
```

---

## API Endpoints with MongoDB

### Add Food Donation
```bash
POST /api/add-food
Content-Type: application/json

{
  "food_name": "Paneer Tikka",
  "donor_name": "Taj Restaurant",
  "quantity": 20,
  "zone": "Indore",
  "address": "...",
  ...
}
```

### Get All Listings (with MongoDB queries)
```bash
GET /api/food?status=available&zone=Vijay%20Nagar
```

### Accept Food Pickup
```bash
PATCH /api/food/{MONGODB_ID}/accept
Content-Type: application/json

{
  "ngo_name": "Roti Bank"
}
```

### Get Donor Stats
```bash
GET /api/donor/Spice%20Garden/stats
```

Returns MongoDB-aggregated data including waste and cost impact.

### Get AI Predictions with Donor History
```bash
GET /api/predict/Monday?donor_name=Spice%20Garden
```

Returns weekend/daily insights WITH donor historical data from MongoDB.

---

## Performance Tips

### Create Indexes for Speed
MongoDB automatically creates the following indexes:
```javascript
db.food_listings.createIndex({ "donor_name": 1 })
db.food_listings.createIndex({ "zone": 1 })
db.food_listings.createIndex({ "status": 1 })
db.food_listings.createIndex({ "created_at": -1 })
```

### Monitor Queries
```bash
mongo
> use nofoodleft
> db.currentOp()
```

---

## Next Steps

1. **Deploy Backend** → Use Heroku, Railway, or AWS with MongoDB Atlas
2. **Add More Analytics** → Query MongoDB for insights
3. **Implement Real Auth** → Store hashed passwords in MongoDB
4. **Archive Old Data** → Use TTL indexes on created_at field

---

**Questions?**  
Check `backend/.env.example` for configuration templates.
