@echo off
echo ========================================
echo Creating Demo Patients
echo ========================================
echo.
echo This will create 5 demo patients (P2-P6)
echo with simulated health data.
echo.
echo Make sure Flask is running first!
echo ========================================
echo.

cd backend
echo y | python create_demo_patients.py

echo.
echo ========================================
echo Done!
echo ========================================
pause
