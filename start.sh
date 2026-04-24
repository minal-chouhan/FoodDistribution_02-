#!/bin/bash
echo ""
echo "  🍛  No Food Left — Starting..."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
  echo "❌ Python3 not found. Install from https://python.org"
  exit 1
fi

# Install backend deps
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/backend"
pip install fastapi uvicorn python-multipart --break-system-packages -q 2>/dev/null || \
pip install fastapi uvicorn python-multipart -q 2>/dev/null

echo ""
echo "✅ Starting server at http://localhost:8000"
echo "   Open your browser → http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
