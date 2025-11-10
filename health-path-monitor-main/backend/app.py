# backend/app.py
from flask import Flask, request, jsonify
import random, time, threading
from firebase_admin import credentials, db, initialize_app
from flask_cors import CORS

# -----------------------------------------------------------------------------
# Initialize Flask + CORS
# -----------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # allows frontend (Vite) to call Flask

# -----------------------------------------------------------------------------
# Firebase Admin SDK connection
# -----------------------------------------------------------------------------
cred = credentials.Certificate("firebase_key.json")
initialize_app(cred, {
    "databaseURL": "https://health-sync-dev-default-rtdb.firebaseio.com/"
})

# -----------------------------------------------------------------------------
# Global tracker for simulations
# -----------------------------------------------------------------------------
simulations = {}

def generate_random_data(patient_id: str):
    """Continuously generate fake health data for a patient."""
    while simulations.get(patient_id, False):
        heart_rate = random.randint(60, 120)
        systolic = random.randint(110, 150)
        diastolic = random.randint(70, 95)
        blood_pressure = f"{systolic}/{diastolic}"
        spo2 = random.randint(93, 100)
        temperature = round(random.uniform(97.0, 101.0), 1)
        timestamp = int(time.time() * 1000)

        reading = {
            "heartRate": heart_rate,
            "bloodPressure": blood_pressure,
            "spo2": spo2,
            "temperature": temperature,
            "timestamp": timestamp
        }

        ref = db.reference(f"health_data/{patient_id}")
        ref.push(reading)
        print(f"✅ Sent data for {patient_id}: {reading}")

        time.sleep(5)

# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.route("/start_simulation", methods=["POST"])
def start_simulation():
    data = request.get_json(force=True)
    print("📩 Received start_simulation request:", data)
    patient_id = data.get("patient_id")
    if not patient_id:
        print("❌ Missing patient_id in request")
        return jsonify({"error": "Missing patient_id"}), 400

    if simulations.get(patient_id):
        print(f"⚠️ Simulation already running for {patient_id}")
        return jsonify({"status": "already running", "patient_id": patient_id})

    simulations[patient_id] = True
    threading.Thread(target=generate_random_data, args=(patient_id,), daemon=True).start()
    print(f"🚀 Simulation started for {patient_id}")
    return jsonify({"status": "simulation started", "patient_id": patient_id})


@app.route("/stop_simulation", methods=["POST"])
def stop_simulation():
    data = request.get_json(force=True)
    patient_id = data.get("patient_id")
    if not patient_id:
        return jsonify({"error": "Missing patient_id"}), 400
    simulations[patient_id] = False
    print(f"🛑 Simulation stopped for {patient_id}")
    return jsonify({"status": "stopped", "patient_id": patient_id})

@app.route("/send_data", methods=["GET"])
def send_data():
    patient_id = request.args.get("patient_id")
    if not patient_id:
        return jsonify({"error": "Missing patient_id"}), 400

    # Generate one random reading
    heart_rate = random.randint(60, 120)
    systolic = random.randint(110, 150)
    diastolic = random.randint(70, 95)
    blood_pressure = f"{systolic}/{diastolic}"
    spo2 = random.randint(93, 100)
    temperature = round(random.uniform(97.0, 101.0), 1)
    timestamp = int(time.time() * 1000)

    reading = {
        "heartRate": heart_rate,
        "bloodPressure": blood_pressure,
        "spo2": spo2,
        "temperature": temperature,
        "timestamp": timestamp
    }

    db.reference(f"health_data/{patient_id}").push(reading)
    print(f"📤 Sent single reading for {patient_id}: {reading}")
    return jsonify({"status": "success", "patient_id": patient_id})



# -----------------------------------------------------------------------------
# Run Flask
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    print("Starting Flask server at http://127.0.0.1:5000 ...")
    app.run(debug=True, host="127.0.0.1", port=5000)
