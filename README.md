# 🍛 No Food Left

AI-powered food waste management platform — Shark Tank / Hackathon demo

---

## ▶️ Run in 30 seconds

### Mac / Linux
```bash
bash start.sh
```

### Windows
```
Double-click start.bat
```

Then open your browser → **http://localhost:8000**

That's it. One command. No npm needed.

---

## If you want to develop (edit code)

You need two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
pip install fastapi uvicorn python-multipart
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend (React dev server with hot reload):**
```bash
cd frontend
npm install
npm run dev
```
Open → **http://localhost:5173**

---

## API Endpoints

| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/food` | All listings (filter: zone, food_type, expiry_level, status) |
| POST | `/api/add-food` | Create new food listing |
| PATCH | `/api/food/{id}/accept` | NGO accepts pickup |
| DELETE | `/api/food/{id}` | Delete listing |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/predict/{day}` | AI demand forecast |

Interactive docs → **http://localhost:8000/docs**

---

## Pages

| Page | Feature |
|------|---------|
| 📊 Dashboard | Live stats, bar chart, recent listings |
| 🍽 Donate Food | 4-step form — type, allergens, restrictions, expiry, pickup |
| 🤝 Find Food | Filter + accept pickup with NGO selector |
| 📍 Map | Leaflet.js + OpenStreetMap live markers |
| 🏠 NGO Hub | Contribution timeline, NGO impact cards |
| 🧠 AI Insights | Demand forecast by day, action plan |

---

## Project structure

```
nofoodleft/
├── start.sh            ← Run this (Mac/Linux)
├── start.bat           ← Run this (Windows)
├── backend/
│   ├── main.py         ← FastAPI — serves API + React app
│   ├── static/         ← Built React app (ready to serve)
│   └── requirements.txt
└── frontend/           ← React source (edit here)
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    │       ├── Dashboard.jsx
    │       ├── Donate.jsx
    │       ├── Listings.jsx
    │       ├── MapPage.jsx
    │       ├── NGOHub.jsx
    │       ├── Predict.jsx
    │       └── UI.jsx
    └── package.json
```

After editing frontend source → rebuild:
```bash
cd frontend && npm run build
```
The backend auto-serves the new build.
