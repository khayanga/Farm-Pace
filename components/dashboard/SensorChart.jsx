
"use client";

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function SensorChart({ series }) {
  // series = [{ value, recordedAt, unit }, ... ] - already sorted oldest -> newest
  const data = (series || []).map((s) => ({
    time: format(new Date(s.recordedAt), "HH:mm"),
    value: s.value,
  }));

  if (!data.length) {
    return <div className="p-8 text-center text-sm text-muted-foreground">No data to display</div>;
  }

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
