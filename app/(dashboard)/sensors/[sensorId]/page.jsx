"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SensorPage() {
  const { sensorId } = useParams();
  const [metrics, setMetrics] = useState([
    { metric: "temperature_day", value: "", unit: "°C" },
    { metric: "temperature_night", value: "", unit: "°C" },
    { metric: "humidity", value: "", unit: "%" },
    { metric: "soil_moisture", value: "", unit: "%" },
  ]);
  const [loading, setLoading] = useState(false);
  const [metricsData, setMetricsData] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...metrics];
    updated[index][field] = value;
    setMetrics(updated);
  };

  useEffect(() => {
    if (!sensorId) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/sensors/${sensorId}`);
        const data = await res.json();
        if (res.ok) {
          setMetricsData(data.readings);
        } else {
          console.error(data.error || "Failed to load metrics");
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [sensorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/sensors/${sensorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Metrics recorded!");
        setMetrics(metrics.map((m) => ({ ...m, value: "" })));
        // Refresh metricsData
        setMetricsData((prev) => [...prev, ...metrics.map((m) => ({
          ...m,
          id: prev.length + Math.random(), // temporary id
          recordedAt: new Date().toISOString()
        }))]);
      } else {
        toast.error(data.error || "Failed to record metrics");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving metrics");
    } finally {
      setLoading(false);
    }
  };

  // Transform metricsData for graphs
  const graphData = metricsData.map((m) => ({
    name: new Date(m.recordedAt).toLocaleString(),
    [m.metric]: m.value,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md bg-white p-6 rounded-2xl shadow-lg border"
      >
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {m.metric.replace("_", " ")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={m.value}
                onChange={(e) => handleChange(i, "value", e.target.value)}
                placeholder={`e.g. ${
                  m.metric.includes("temperature") ? "25.5" : "60"
                }`}
                className="w-28 border rounded-lg p-2 text-center focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-gray-600 text-sm">{m.unit}</span>
            </div>
          </div>
        ))}

        <Button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Metrics"}
        </Button>
      </form>

      {/* Table */}
      {/* <div className="overflow-x-auto border rounded-lg shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Metric</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Unit</th>
              <th className="px-4 py-2 text-left">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {metricsData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No sensor data recorded yet.
                </td>
              </tr>
            ) : (
              metricsData.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-2 capitalize">
                    {m.metric.replace("_", " ")}
                  </td>
                  <td className="px-4 py-2">{m.value}</td>
                  <td className="px-4 py-2">{m.unit}</td>
                  <td className="px-4 py-2">
                    {new Date(m.recordedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}

      {/* Graph */}
      {metricsData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">Metrics Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metricsData.map((m) => (
                <Line
                  key={m.metric}
                  type="monotone"
                  dataKey={m.metric}
                  stroke={
                    m.metric.includes("temperature") ? "#f87171" :
                    m.metric === "humidity" ? "#3b82f6" :
                    "#10b981"
                  }
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
