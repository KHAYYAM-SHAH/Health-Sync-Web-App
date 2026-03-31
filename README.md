# Health Sync Web App
Personal Health Monitoring System
Complete Project Documentation & Technical README
Live Site: https://health-sync-dev.web.app/

Version: 1.0.0	Status: Production Ready	Risk Engine: ML-Powered


1. Project Overview
HealthSync is a web-based, real-time health monitoring platform designed for old age homes, hospitals, and care facilities. It enables supervisors to track the health metrics of multiple individuals simultaneously through a single centralized dashboard — eliminating the need for manual rounds and reducing critical-event response times.
The system was originally conceived by an old age home owner who needed a digital solution to monitor elderly residents' daily vitals, activity levels, and sleep patterns without requiring physical presence. HealthSync fulfills this vision through an end-to-end pipeline: from wearable fitness tracker to cloud database to web dashboard.
Core Objectives
•	Monitor multiple patients/residents from a single supervisor screen
•	Track daily, weekly, and monthly health metrics: BP, Steps, Exercise time, Sleep schedule, Heart Rate, Calories, Distance
•	Automatically detect health deterioration using ML-based pattern analysis
•	Send real-time risk notifications (Normal / Medium / High Risk)
•	Support multiple supervisors with separate login and patient assignment
•	Store all data persistently in a cloud database (Firebase)

2. System Architecture
2.1 High-Level Architecture
HealthSync consists of three major layers:
•	Data Collection Layer — Wearable device + companion app + Health Connect bridge
•	Backend Layer — Firebase Realtime Database (24/7 live sync)
•	Frontend Layer — React.js web dashboard with ML inference engine
2.2 Data Flow Pipeline
The complete data pipeline from wearable device to dashboard is:

①
Watch
Amazefit Pace	→	②
Zepp App
Official Sync App	→	③
Health Connect
Google's New API	→	④
Sync App
Our Android App	→	⑤
Firebase
Realtime DB

Final Notation: Watch → Zepp App → Health Connect (SDK) → Health Connect Sync (our custom Android app) → Firebase Realtime Database → HealthSync Web Dashboard

3. Technology Stack
Layer	Technology	Purpose
Frontend	React.js	Web dashboard UI
Frontend	Chart.js / Recharts	Health metric visualizations & histograms
ML Engine	K-Means Clustering	Current day health analysis & risk classification
ML Engine	Trend / Deterioration Model	Long-range pattern detection for declining health
Backend	Firebase Realtime DB	24/7 live cloud data storage & sync
Mobile Bridge	Health Connect SDK (Android)	Reads synced data from Zepp App
Mobile Bridge	Custom Android App (Health Connect Sync)	Pulls Health Connect data & pushes to Firebase
Wearable	Amazefit Pace (Xiaomi)	Fitness tracking device worn by patient
Wearable App	Zepp (Official)	Syncs watch data to Health Connect
Auth	Firebase Auth	Supervisor and doctor login management

4. Key Features
4.1 Multi-Patient Dashboard
Supervisors log in and see all assigned patients on one screen. Each patient card shows live values for:
•	Heart Rate (BPM)
•	Steps (daily count)
•	Calories Burned (kcal)
•	Distance Covered (km)
•	Sleep Duration (hours)
•	Workout/Exercise Time (minutes)
4.2 Risk Level Indicator
Every patient profile displays a color-coded Risk Level badge — Normal, Medium Risk, or High Risk — automatically computed by the trained ML model based on the Fitbit fitness tracker dataset.
4.3 ML Analysis Modes
Two separate analysis modes are available via dedicated buttons on the dashboard:

Current Health Analysis
Analyzes today's data using K-Means ML clustering. Determines which health cluster the patient falls into based on current readings and assigns a real-time risk score.	Detect Health Deterioration
Analyzes past historical trends to detect declining health patterns over time. Identifies gradual metric drops (steps, sleep, workout) that indicate long-range deterioration.

4.4 Health History & Histograms
Every data point recorded by the patient is saved to Firebase with a timestamp. The system automatically builds a historical bar chart (normalized scale) combining Heart Rate, Steps, Calories, and Distance across the full timeline — enabling supervisors and doctors to visually review trends week-over-week or month-over-month.
4.5 Multi-Role Authentication
•	Supervisor Login: Can view all assigned patients, manage notifications
•	Doctor Login: Has a separate login and can only view their own assigned patients
•	Firebase Auth: Manages all user credentials securely
4.6 Notifications
Real-time notifications are triggered on the screen whenever any health factor crosses a risk threshold — particularly when values drop significantly or if deterioration is detected. Notification types include:
•	Normal — All metrics within expected range
•	Medium Risk — One or more metrics trending downward
•	High Risk — Critical drop or accelerated deterioration detected

5. Key Technical Challenge: Wearable-to-Web Data Pipeline
5.1 Problem Statement
The biggest technical challenge in this project was determining which smartwatch to use and, more critically, how to reliably transfer data from that watch to the web dashboard. The client's original requirement was straightforward: use a website and bring data from the watch to the site using the Google Fit API.
5.2 Google Fit API Deprecation
Critical Issue: In 2024, Google officially deprecated the Google Fit API. This API was the original bridge planned for reading watch data. After deprecation, the API could no longer be used for new integrations, completely blocking our initially planned data flow.
5.3 Device Selection Challenge
The client proposed the Xiaomi Amazefit Pace as the target wearable device. While this device has a good set of health sensors, it does not natively expose an open API for third-party applications — it requires syncing through the official Zepp companion application.
5.4 Solution: Health Connect Bridge
After researching alternatives to Google Fit, the team identified Google Health Connect as the official successor API. Health Connect is the new standard for health data interoperability on Android.
The solution was architected as follows:
Step 1 — Zepp App Setup
The official Zepp app was installed and configured to sync with the Amazefit Pace. This sync pushes all health metrics (heart rate, steps, sleep, etc.) from the watch into the Zepp ecosystem.
Step 2 — Zepp → Health Connect Sync
Zepp was configured to sync its data into Google Health Connect — Google's official replacement for Google Fit. Health Connect acts as a secure, standardized health data repository on the Android device.
Step 3 — Custom Android App (Health Connect Sync)
A custom Android application was developed by the team — named "Health Connect Sync". This app uses the official Health Connect SDK to read health data from the Health Connect repository on the device.
Step 4 — Firebase Upload
The Health Connect Sync app then pushes all retrieved health data to the Firebase Realtime Database. From Firebase, the HealthSync web dashboard reads and displays the data in real-time, 24/7.
5.5 Final Data Pipeline Summary
Watch	Amazefit Pace (Xiaomi) — worn by patient, collects biometrics
Zepp App	Official companion app, syncs watch data to Health Connect
Health Connect	Google's new health data API (replaced Google Fit 2024)
Health Connect Sync	Our custom Android app — reads HC data via SDK
Firebase	Realtime Database — stores all patient health data 24/7
Web Dashboard	HealthSync React app — reads Firebase and renders dashboard

6. Machine Learning Model
6.1 Training Dataset
The ML models were trained using the publicly available Fitbit Fitness Tracker dataset. This dataset contains multi-day health metrics from real users, including step counts, heart rate values, calories burned, sleep duration, and activity intensity levels.
6.2 Current Health Analysis — K-Means Clustering
K-Means clustering was used to segment patients into health clusters based on their current-day readings. Each cluster corresponds to a risk level:
•	Cluster A → Normal (healthy activity levels, stable vitals)
•	Cluster B → Medium Risk (mild drop in one or more metrics)
•	Cluster C → High Risk (critical drop or multiple metrics below threshold)
6.3 Deterioration Detection Model
A separate model was developed to analyze historical trends rather than just current values. This model:
•	Looks at rolling averages of steps, sleep, workout duration, and heart rate over days/weeks
•	Detects sustained downward trends that indicate gradual health decline
•	Flags patients showing deterioration even if any single day's readings appear acceptable
•	Particularly important for elderly patients where gradual decline is more dangerous than sudden spikes
6.4 Risk Notification Engine
The system automatically generates on-screen notifications whenever the risk classification changes for any patient. Supervisors do not need to manually check — alerts surface proactively based on model outputs.

7. Installation & Setup Guide
7.1 Prerequisites — Install These First
Before doing anything, make sure the following three tools are installed on your machine:
Tool	Version Required	Download Link
Node.js	v18 or higher	https://nodejs.org
Python	v3.14+	https://python.org/downloads
VS Code	Latest	https://code.visualstudio.com

7.2 Step 1 — PowerShell Execution Policy (Windows Only)
Before running any scripts on Windows, you need to allow PowerShell to run local scripts. Open PowerShell as normal user and run:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# When prompted, press  Y  then Enter

7.3 Step 2 — Frontend Setup
Open the project folder in VS Code, then open the integrated terminal (Ctrl + `) and run:
# Navigate to the frontend folder
cd health-path-monitor-main
# Install all frontend dependencies
npm install
✅  Frontend setup complete after npm install finishes without errors.

7.4 Step 3 — Backend Setup
Now navigate to the backend folder and install Python dependencies:
# Navigate into backend folder
cd backend
# Install all Python requirements
pip install -r requirements.txt
⚠️  If you face errors with scikit-learn installation:
Some machines have issues compiling scikit-learn from source. Run this command to force a pre-built binary install, then re-run requirements:
# Force pre-built binary for scikit-learn
pip install scikit-learn --only-binary=:all:
# Then re-run requirements
pip install -r requirements.txt

7.5 Step 4 — Train the ML Models
The ML models need to be trained before the backend can classify risk levels. Run these commands from the backend folder:
# Make sure you are inside the backend folder
cd backend
# Train the K-Means current health model
python train_health_model.py
# Train the deterioration / trend detection model
python train_trend_model.py

7.6 Step 5 — Start the Backend Server
Once models are trained, start the Flask/Python backend server:
python app.py
# Backend will start running on http://localhost:5000
✅  Backend is now live. Keep this terminal open while using the app.

7.7 Step 6 — Start the Frontend
Open a second terminal in VS Code, navigate back to the frontend folder, and start the React app:
cd health-path-monitor-main
npm start
# App will open at http://localhost:3000

#	Step	Command / Action
1	Set PowerShell policy	Set-ExecutionPolicy RemoteSigned -Scope CurrentUser → Y
2	Go to frontend folder	cd health-path-monitor-main
3	Install frontend deps	npm install
4	Go to backend folder	cd backend
5	Install Python deps	pip install -r requirements.txt
6	Fix scikit-learn (if error)	pip install scikit-learn --only-binary=:all:
7	Train health model	python train_health_model.py
8	Train trend model	python train_trend_model.py
9	Start backend	python app.py
10	Start frontend	cd health-path-monitor-main → npm start
7.8 Android App (Health Connect Sync) Setup
•	Open the Health Connect Sync project in Android Studio
•	Add your google-services.json from Firebase to the app/ directory
•	Ensure Health Connect is installed on the target device (Android 9+)
•	Grant all required permissions: Steps, Heart Rate, Sleep, Activity
•	Build and install the APK on the patient's Android phone
•	The app will automatically sync data to Firebase on a scheduled interval
7.9 Watch & Zepp Configuration
•	Install the Zepp app from the Google Play Store
•	Pair the Amazefit Pace with Zepp via Bluetooth
•	In Zepp settings, enable Health Connect data sharing
•	Verify sync is active: Zepp → Settings → Third-party platforms → Health Connect

8. Firebase Database Structure
Data is organized in Firebase Realtime Database with the following hierarchy:
healthsync-db/
  patients/
    P1/
      profile/  { name, age, assignedDoctor, assignedSupervisor }
      healthData/
        [timestamp]/  { heartRate, steps, calories, distance, sleep, workout }
      riskLevel/  { current, lastUpdated }
  users/
    [uid]/  { role, name, assignedPatients[] }

9. Future Enhancements
•	Add support for blood pressure (BP) monitors via Bluetooth LE integration
•	Expand wearable support to other brands (Fitbit, Garmin, Apple Watch via HealthKit)
•	Build a mobile supervisor app (iOS/Android) for on-the-go monitoring
•	Add emergency SOS alert — auto-call nurse station if critical threshold breached
•	Integrate video/audio note-taking for doctors within patient profiles
•	Multi-facility support: one admin can manage multiple care home branches
•	Add PDF export of weekly health reports per patient
•	Implement LSTM/time-series deep learning for more accurate deterioration forecasting

10. Project Credits
Project Name	HealthSync — Personal Health Monitoring System
Domain	Healthcare Technology / IoT / Machine Learning
Database	Firebase Realtime Database
ML Dataset	Fitbit Fitness Tracker Dataset (Public)
Wearable Device	Amazefit Pace (Xiaomi)
Target Users	Old Age Homes, Hospitals, Care Facilities
System Type	Multi-patient, Multi-supervisor, Multi-doctor

HealthSync — Keeping Every Heartbeat Counted
Built with care for those who care.


