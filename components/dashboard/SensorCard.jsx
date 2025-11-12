// components/ui/SensorCard.jsx
import React from "react";

const thresholds = {
  temperature_day: { min: 16, max: 30 },
  temperature_night: { min: 13, max: 18 },
  humidity: { max: 80 },
  soil_moisture: { min: 60, max: 85 },
  soil_ph: { min: 5.5, max: 6.5 },
};

function statusFor(metric, value) {
  const t = thresholds[metric];
  if (!t || value == null) return { label: "unknown", color: "gray" };
  if ((t.min != null && value < t.min) || (t.max != null && value > t.max)) return { label: "alert", color: "red" };
  return { label: "ok", color: "green" };
}

export default function SensorCard({ metric, reading }) {
  const latest = reading || null;
  const val = latest?.value ?? null;
  const unit = latest?.unit ?? "";
  const time = latest?.recordedAt ? new Date(latest.recordedAt).toLocaleTimeString() : "---";
  const s = statusFor(metric, val);

  return (
    <div className="p-4 rounded border bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{metric.replace("_", " ").toUpperCase()}</div>
          <div className="text-2xl font-bold">{val != null ? `${val}${unit}` : "--"}</div>
          <div className="text-xs text-muted-foreground">as of {time}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${s.color === "red" ? "bg-red-500" : s.color === "green" ? "bg-green-500" : "bg-gray-400"}`}>
          {s.label.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
