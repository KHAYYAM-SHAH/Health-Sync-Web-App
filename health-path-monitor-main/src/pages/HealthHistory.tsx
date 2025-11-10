import { Sidebar } from '@/components/Sidebar';
import { HealthChart } from '@/components/HealthChart';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";

interface HealthReading {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  timestamp: number;
}

export default function HealthHistory() {
  const { user } = useAuth();
  const { patientId } = usePatient();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const effectiveId = user?.role === "doctor" ? patientId : user?.uid;

  useEffect(() => {
    if (!effectiveId) { setReadings([]); return; }
    const dataRef = ref(database, `health_data/${effectiveId}`);
    const unsub = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setReadings([]);
      const formatted = Object.values(data).map((r: any) => ({
        heartRate: r.heartRate,
        bloodPressureSystolic: r.bloodPressure ? parseInt(r.bloodPressure.split("/")[0]) : 0,
        bloodPressureDiastolic: r.bloodPressure ? parseInt(r.bloodPressure.split("/")[1]) : 0,
        oxygenLevel: r.spo2,
        temperature: r.temperature,
        timestamp: r.timestamp,
      }));
      setReadings(formatted.reverse());
    });
    return () => unsub();
  }, [effectiveId]);

  const handleExport = () => {
    if (!readings.length) return;
    const csv = [
      ['Date', 'Heart Rate', 'Blood Pressure', 'Oxygen', 'Temperature'],
      ...readings.map(r => [
        new Date(r.timestamp).toLocaleString(),
        r.heartRate,
        `${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}`,
        r.oxygenLevel,
        r.temperature.toFixed(1),
      ]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${effectiveId || 'patient'}_health_history.csv`;
    a.click();
  };

  // prepare chart data
  const chartData = readings.slice(0, 20).map((r) => ({
    date: new Date(r.timestamp).toLocaleTimeString(),
    heartRate: r.heartRate,
    systolic: r.bloodPressureSystolic,
    diastolic: r.bloodPressureDiastolic,
    oxygen: r.oxygenLevel,
    temperature: Number(r.temperature.toFixed(1)),
  }));

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 lg:ml-0 ml-16">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Health History</h1>
            <Button onClick={handleExport} className="gap-2 gradient-primary" disabled={!readings.length}>
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>

          {!effectiveId ? (
            <p className="text-muted-foreground">Enter a patient ID first to view their health history.</p>
          ) : !readings.length ? (
            <p className="text-muted-foreground">No health data available yet.</p>
          ) : (
            <>
              {/* Four-chart grid identical to patient view */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <HealthChart title="Heart Rate" data={chartData} dataKey="heartRate" color="hsl(var(--danger))" unit=" BPM" />
                <HealthChart title="Blood Oxygen" data={chartData} dataKey="oxygen" color="hsl(var(--primary))" unit=" %" />
                <HealthChart title="Blood Pressure" data={chartData} dataKey="systolic" color="hsl(var(--warning))" unit=" mmHg" />
                <HealthChart title="Temperature" data={chartData} dataKey="temperature" color="hsl(var(--success))" unit=" °F" />
              </div>

              {/* Table identical to patient view */}
              <Card className="p-6 shadow-custom-md">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Readings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Oxygen</TableHead>
                      <TableHead>Temperature</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readings.slice(0, 10).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{r.heartRate} BPM</TableCell>
                        <TableCell>{r.bloodPressureSystolic}/{r.bloodPressureDiastolic} mmHg</TableCell>
                        <TableCell>{r.oxygenLevel}%</TableCell>
                        <TableCell>{r.temperature.toFixed(1)} °F</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
