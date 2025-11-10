// import { useEffect, useState } from 'react';
// import { Heart, Activity, Droplet, Thermometer, RefreshCcw } from 'lucide-react';
// import { Sidebar } from '@/components/Sidebar';
// import { MetricCard } from '@/components/MetricCard';
// import { Badge } from '@/components/ui/badge';
// import { ref, onValue } from "firebase/database";
// import { database } from "../firebase";
// import { usePatient } from "@/contexts/PatientContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";

// interface HealthReading {
//   heartRate: number;
//   bloodPressureSystolic: number;
//   bloodPressureDiastolic: number;
//   oxygenLevel: number;
//   temperature: number;
//   timestamp: number;
// }

// function calculateRiskLevel(reading: HealthReading) {
//   if (!reading) return "low";
//   const { heartRate, bloodPressureSystolic, bloodPressureDiastolic, oxygenLevel, temperature } = reading;
//   if (heartRate > 120 || bloodPressureSystolic > 150 || bloodPressureDiastolic > 95 || oxygenLevel < 92 || temperature > 100.4)
//     return "high";
//   if (heartRate > 100 || bloodPressureSystolic > 135 || bloodPressureDiastolic > 90 || oxygenLevel < 95 || temperature > 99)
//     return "moderate";
//   return "low";
// }

// export default function Dashboard() {
//   const [reading, setReading] = useState<HealthReading | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { patientId, setPatientId } = usePatient();
//   const [patientInput, setPatientInput] = useState("");
//   const { user } = useAuth();

//   const effectiveId = user?.role === "doctor" ? patientId : user?.uid;

//   useEffect(() => {
//     setReading(null);
//     setLoading(true);
//     if (!effectiveId) {
//       setLoading(false);
//       return;
//     }

//     const dataRef = ref(database, `health_data/${effectiveId}`);
//     const unsub = onValue(dataRef, (snapshot) => {
//       const val = snapshot.val();
//       if (!val) {
//         setReading(null);
//         setLoading(false);
//         return;
//       }
//       const entries = Object.values(val) as any[];
//       const last = entries[entries.length - 1];
//       if (last) {
//         const newReading: HealthReading = {
//           heartRate: last.heartRate ?? 0,
//           bloodPressureSystolic: last.bloodPressure ? parseInt(last.bloodPressure.split("/")[0]) : 0,
//           bloodPressureDiastolic: last.bloodPressure ? parseInt(last.bloodPressure.split("/")[1]) : 0,
//           oxygenLevel: last.spo2 ?? 0,
//           temperature: last.temperature ?? 0,
//           timestamp: last.timestamp ?? Date.now(),
//         };
//         setReading(newReading);
//       } else setReading(null);
//       setLoading(false);
//     });
//     return () => unsub();
//   }, [effectiveId]);

//   // ----- Doctor patient entry screen -----
//   if (user?.role === "doctor" && !patientId) {
//     return (
//       <div className="flex h-screen w-full">
//         <Sidebar />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center space-y-4">
//             <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
//             <p className="text-muted-foreground">Enter a Patient ID to view their health data</p>

//             <div className="mt-6 flex items-center justify-center gap-3">
//               <input
//                 type="text"
//                 value={patientInput}
//                 onChange={(e) => setPatientInput(e.target.value)}
//                 placeholder="Enter Patient ID"
//                 className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 onClick={() => patientInput.trim() && setPatientId(patientInput.trim())}
//                 className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
//               >
//                 View Patient
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (loading || !reading) {
//     return (
//       <div className="flex h-screen w-full">
//         <Sidebar />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <Activity className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
//             <p className="text-muted-foreground">
//               {user?.role === "doctor" ? "Enter or switch a patient ID to view data" : "Waiting for live health data..."}
//             </p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   const riskLevel = calculateRiskLevel(reading);
//   const statusMap = {
//     low: { label: "Low Risk", className: "bg-success text-success-foreground" },
//     moderate: { label: "Moderate Risk", className: "bg-warning text-warning-foreground" },
//     high: { label: "High Risk", className: "bg-danger text-danger-foreground" },
//   };
//   const status = statusMap[riskLevel];

//   return (
//     <div className="flex h-screen w-full">
//       <Sidebar />
//       <main className="flex-1 overflow-auto">
//         <div className="max-w-7xl mx-auto p-6 lg:p-8 lg:ml-0 ml-16">
//           {/* Header */}
//           <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">Health Dashboard</h1>
//               <p className="text-muted-foreground">Last updated: {new Date(reading.timestamp).toLocaleString()}</p>
//               {user?.role === "doctor" && (
//                 <div className="flex items-center gap-3 mt-2">
//                   <p className="text-sm text-muted-foreground">Viewing patient: <span className="font-semibold">{patientId}</span></p>
//                   <Button variant="outline" size="sm" onClick={() => setPatientId(null)}>
//                     <RefreshCcw className="h-4 w-4 mr-1" /> Change
//                   </Button>
//                 </div>
//               )}
//             </div>
//             <Badge className={`text-lg px-6 py-2 ${status.className}`}>{status.label}</Badge>
//           </div>

//           {/* Metric cards (same as before) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <MetricCard title="Heart Rate" value={reading.heartRate} unit="BPM" icon={Heart} status={reading.heartRate >= 60 && reading.heartRate <= 100 ? 'normal' : 'warning'} trend="stable" animate />
//             <MetricCard title="Blood Pressure" value={`${reading.bloodPressureSystolic}/${reading.bloodPressureDiastolic}`} unit="mmHg" icon={Activity} status={reading.bloodPressureSystolic <= 130 && reading.bloodPressureDiastolic <= 85 ? 'normal' : reading.bloodPressureSystolic <= 140 ? 'warning' : 'danger'} trend="up" />
//             <MetricCard title="Blood Oxygen" value={reading.oxygenLevel} unit="%" icon={Droplet} status={reading.oxygenLevel >= 95 ? 'normal' : 'danger'} trend="stable" />
//             <MetricCard title="Temperature" value={reading.temperature.toFixed(1)} unit="°F" icon={Thermometer} status={reading.temperature >= 97 && reading.temperature <= 99 ? 'normal' : reading.temperature <= 100.4 ? 'warning' : 'danger'} trend="stable" />
//           </div>

//           {/* Quick Tips and Summary remain unchanged */}
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="gradient-card p-6 rounded-xl shadow-custom-md border border-border/50">
//               <h3 className="text-lg font-semibold mb-4 text-foreground">Health Summary</h3>
//               <p className="text-sm text-foreground">
//                 Your vitals are {riskLevel === 'low' ? 'within normal ranges' : riskLevel === 'moderate' ? 'showing some concerns' : 'outside normal ranges'}.
//               </p>
//             </div>
//             <div className="gradient-card p-6 rounded-xl shadow-custom-md border border-border/50">
//               <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Tips</h3>
//               <ul className="space-y-2 text-sm text-muted-foreground">
//                 <li>✓ Take measurements daily at the same time</li>
//                 <li>✓ Stay hydrated and exercise regularly</li>
//                 <li>✓ Track trends for better insights</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Heart, Activity, Droplet, Thermometer, RefreshCcw } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface HealthReading {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  timestamp: number;
}

function calculateRiskLevel(reading: HealthReading) {
  if (!reading) return "low";
  const { heartRate, bloodPressureSystolic, bloodPressureDiastolic, oxygenLevel, temperature } = reading;
  if (
    heartRate > 120 ||
    bloodPressureSystolic > 150 ||
    bloodPressureDiastolic > 95 ||
    oxygenLevel < 92 ||
    temperature > 100.4
  )
    return "high";
  if (
    heartRate > 100 ||
    bloodPressureSystolic > 135 ||
    bloodPressureDiastolic > 90 ||
    oxygenLevel < 95 ||
    temperature > 99
  )
    return "moderate";
  return "low";
}

export default function Dashboard() {
  const [reading, setReading] = useState<HealthReading | null>(null);
  const [loading, setLoading] = useState(true);
  const { patientId, setPatientId } = usePatient();
  const [patientInput, setPatientInput] = useState("");
  const { user } = useAuth();
  const [patientName, setPatientName] = useState<string | null>(null);

  const effectiveId = user?.role === "doctor" ? patientId : user?.uid;

  // 🔹 Fetch current user’s or selected patient’s health data
  useEffect(() => {
    setReading(null);
    setLoading(true);
    if (!effectiveId) {
      setLoading(false);
      return;
    }

    const dataRef = ref(database, `health_data/${effectiveId}`);
    const unsub = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setReading(null);
        setLoading(false);
        return;
      }
      const entries = Object.values(val) as any[];
      const last = entries[entries.length - 1];
      if (last) {
        const newReading: HealthReading = {
          heartRate: last.heartRate ?? 0,
          bloodPressureSystolic: last.bloodPressure ? parseInt(last.bloodPressure.split("/")[0]) : 0,
          bloodPressureDiastolic: last.bloodPressure ? parseInt(last.bloodPressure.split("/")[1]) : 0,
          oxygenLevel: last.spo2 ?? 0,
          temperature: last.temperature ?? 0,
          timestamp: last.timestamp ?? Date.now(),
        };
        setReading(newReading);
      } else setReading(null);
      setLoading(false);
    });
    return () => unsub();
  }, [effectiveId]);

  // 🔹 Fetch patient name (for both doctor & patient)
  useEffect(() => {
    if (!effectiveId) {
      setPatientName(null);
      return;
    }

    const userRef = ref(database, `users/${effectiveId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPatientName(data.fullName || "Unnamed User");
      } else {
        setPatientName(null);
      }
    });
  }, [effectiveId]);

  // ----- Doctor’s patient entry screen -----
  if (user?.role === "doctor" && !patientId) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Enter a Patient ID to view their health data</p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <input
                type="text"
                value={patientInput}
                onChange={(e) => setPatientInput(e.target.value)}
                placeholder="Enter Patient ID"
                className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => patientInput.trim() && setPatientId(patientInput.trim())}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                View Patient
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading || !reading) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">
              {user?.role === "doctor"
                ? "Enter or switch a patient ID to view data"
                : "Waiting for live health data..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const riskLevel = calculateRiskLevel(reading);
  const statusMap = {
    low: { label: "Low Risk", className: "bg-success text-success-foreground" },
    moderate: { label: "Moderate Risk", className: "bg-warning text-warning-foreground" },
    high: { label: "High Risk", className: "bg-danger text-danger-foreground" },
  };
  const status = statusMap[riskLevel];

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 lg:ml-0 ml-16">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {user?.role === "doctor"
                  ? `Doctor Dashboard`
                  : `Welcome, ${patientName || "User"}`}
              </h1>

              {user?.role === "doctor" && patientName && (
                <p className="text-muted-foreground mb-1">
                  Viewing data for: <span className="font-semibold">{patientName}</span> (
                  ID: {patientId})
                </p>
              )}

              <p className="text-muted-foreground">
                Last updated: {new Date(reading.timestamp).toLocaleString()}
              </p>

              {user?.role === "doctor" && (
                <div className="flex items-center gap-3 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setPatientId(null)}>
                    <RefreshCcw className="h-4 w-4 mr-1" /> Change Patient
                  </Button>
                </div>
              )}
            </div>
            <Badge className={`text-lg px-6 py-2 ${status.className}`}>{status.label}</Badge>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Heart Rate"
              value={reading.heartRate}
              unit="BPM"
              icon={Heart}
              status={
                reading.heartRate >= 60 && reading.heartRate <= 100
                  ? "normal"
                  : "warning"
              }
              trend="stable"
              animate
            />
            <MetricCard
              title="Blood Pressure"
              value={`${reading.bloodPressureSystolic}/${reading.bloodPressureDiastolic}`}
              unit="mmHg"
              icon={Activity}
              status={
                reading.bloodPressureSystolic <= 130 &&
                reading.bloodPressureDiastolic <= 85
                  ? "normal"
                  : reading.bloodPressureSystolic <= 140
                  ? "warning"
                  : "danger"
              }
              trend="up"
            />
            <MetricCard
              title="Blood Oxygen"
              value={reading.oxygenLevel}
              unit="%"
              icon={Droplet}
              status={reading.oxygenLevel >= 95 ? "normal" : "danger"}
              trend="stable"
            />
            <MetricCard
              title="Temperature"
              value={reading.temperature.toFixed(1)}
              unit="°F"
              icon={Thermometer}
              status={
                reading.temperature >= 97 && reading.temperature <= 99
                  ? "normal"
                  : reading.temperature <= 100.4
                  ? "warning"
                  : "danger"
              }
              trend="stable"
            />
          </div>

          {/* Summary + Quick Tips */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="gradient-card p-6 rounded-xl shadow-custom-md border border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Health Summary</h3>
              <p className="text-sm text-foreground">
                Your vitals are{" "}
                {riskLevel === "low"
                  ? "within normal ranges"
                  : riskLevel === "moderate"
                  ? "showing some concerns"
                  : "outside normal ranges"}
                .
              </p>
            </div>
            <div className="gradient-card p-6 rounded-xl shadow-custom-md border border-border/50">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Take measurements daily at the same time</li>
                <li>✓ Stay hydrated and exercise regularly</li>
                <li>✓ Track trends for better insights</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
