
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Dummy Sensor Data
const soilData = [
  { day: "Mon", moisture: 40, ph: 6.5, ec: 1.2 },
  { day: "Tue", moisture: 55, ph: 6.8, ec: 1.3 },
  { day: "Wed", moisture: 50, ph: 6.4, ec: 1.1 },
  { day: "Thu", moisture: 65, ph: 6.7, ec: 1.4 },
  { day: "Fri", moisture: 70, ph: 6.6, ec: 1.3 },
];

const weatherData = [
  { day: "Mon", temp: 22, rainfall: 5 },
  { day: "Tue", temp: 26, rainfall: 0 },
  { day: "Wed", temp: 24, rainfall: 12 },
  { day: "Thu", temp: 28, rainfall: 2 },
  { day: "Fri", temp: 25, rainfall: 10 },
];

const yieldData = [
  { day: "Mon", yield: 120 },
  { day: "Tue", yield: 150 },
  { day: "Wed", yield: 180 },
  { day: "Thu", yield: 200 },
  { day: "Fri", yield: 170 },
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 w-full">

        {/* <h1 className="font-bold tracking-wider text-p">Here are some statics </h1> */}

      {/* ✅ Soil Health Chart */}
      <Card className="shadow-sm border rounded-2xl">
        <CardHeader>
          <CardTitle>Soil Health Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moisture" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="ph" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="ec" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Weather & Rainfall */}
      <Card className="shadow-sm border rounded-2xl">
        <CardHeader>
          <CardTitle>Weather & Rainfall</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="temp" fill="#3b82f6" />
              <Bar dataKey="rainfall" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Yield Trends */}
      <Card className="shadow-sm border rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle>Daily Yield Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="yield"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
