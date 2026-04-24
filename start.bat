@echo off
echo.
echo   No Food Left - Starting...
echo.
cd /d "%~dp0backend"
pip install fastapi uvicorn python-multipart -q
echo.
echo Starting at http://localhost:8000
echo Open browser: http://localhost:8000
echo Press Ctrl+C to stop
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
