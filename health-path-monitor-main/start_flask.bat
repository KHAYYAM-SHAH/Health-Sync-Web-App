@echo off
echo ========================================
echo Starting Flask Server
echo ========================================
echo.
echo Flask will run on http://127.0.0.1:5000
echo.
echo IMPORTANT: Keep this window open!
echo Press Ctrl+C to stop Flask
echo ========================================
echo.

cd backend
python app.py

pause
