
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import SensorChart from "@/components/dashboard/SensorChart";
import SensorCard from "@/components/dashboard/SensorCard";

export default function FarmSensorsPage() {
  const { id: farmId } = useParams();
  const [data, setData] = useState({});
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  async function fetchData() {
    if (!farmId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/farms/${farmId}/sensor-data`);
      const json = await res.json();
      if (res.ok) {
        setData(json.data || {});
        setFarm(json.farm || null);
      } else {
        console.error("Failed to fetch sensor data", json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // polling every 10s
    pollingRef.current = setInterval(fetchData, 10_000);
    return () => clearInterval(pollingRef.current);
  }, [farmId]);

  // latest value extraction
  function latest(metric) {
    const arr = data[metric];
    if (!arr || arr.length === 0) return null;
    return arr[arr.length - 1];
  }

  async function handleSimulate() {
    if (!farmId) return;
    try {
      const res = await fetch(`/api/farms/${farmId}/sensor-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulate: true, count: 6 }),
      });
      if (res.ok) {
        fetchData();
      } else {
        console.error("Simulate failed", await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }

  const metrics = Object.keys(data);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Farm Sensors {farm ? `— ${farm.name} (${farm.code})` : ""}</h1>
          <p className="text-sm text-muted-foreground">Realtime & historical sensor readings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSimulate} className="bg-blue-600 text-white px-4 py-2 rounded">Simulate data</button>
          <button onClick={fetchData} className="bg-gray-200 px-3 py-2 rounded">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {["temperature_day","temperature_night","humidity","soil_moisture","soil_ph"].map((m) => {
          const l = latest(m);
          return <SensorCard key={m} metric={m} reading={l} />;
        })}
      </div>

      <div className="space-y-6">
        {metrics.length === 0 ? (
          <p className="text-center text-muted-foreground">No sensor data yet. Click “Simulate data” to add sample readings.</p>
        ) : (
          metrics.map((metric) => (
            <div key={metric} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{metric.replace("_", " ").toUpperCase()}</h3>
                <div className="text-sm text-muted-foreground">
                  Latest: {latest(metric) ? `${latest(metric).value}${latest(metric).unit || ""} @ ${format(new Date(latest(metric).recordedAt), "HH:mm:ss")}` : "—"}
                </div>
              </div>
              <SensorChart series={data[metric] || []} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
