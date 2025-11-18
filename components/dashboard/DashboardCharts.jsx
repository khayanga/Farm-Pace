// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// export function DashboardCharts() {
//   const [weatherData, setWeatherData] = React.useState([])

//   // Fetch GPS → Fetch weather → Push into chart
//   React.useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(async (pos) => {
//         const { latitude, longitude } = pos.coords

//         async function loadWeather() {
//           const res = await fetch(`/api/real-time?lat=${latitude}&lon=${longitude}`)
//           const json = await res.json()

//           setWeatherData((prev) => [
//             ...prev,
//             {
//               date: new Date().toISOString(),
//               temperature: json.temperature,
//               humidity: json.humidity,
//               soil_moisture: json.soil_moisture,

//             },
//           ])
//         }

//         loadWeather()

//         const interval = setInterval(loadWeather, 60000)
//         return () => clearInterval(interval)
//       })
//     }
//   }, [])

//   const chartConfig = {
//     temperature: {
//       label: "Temperature (°C)",
//       color: "var(--chart-1)",
//     },
//     humidity: {
//       label: "Humidity (%)",
//       color: "var(--chart-2)",
//     },
//     soil_moisture: {
//       label: "Soil moisture (%)",
//       color: "var(--chart-3)",
//     },
//   }

//   return (
//     <Card className="pt-0">
//       <CardHeader className="border-b py-5">
//         <div className="grid gap-1">
//           <CardTitle>Weather Monitoring Chart</CardTitle>
//           <CardDescription>
//             Real-time temperature & humidity readings from your location
//           </CardDescription>
//         </div>
//       </CardHeader>

//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <AreaChart data={weatherData}>
//             <defs>
//               <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0.1} />
//               </linearGradient>

//               <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="var(--color-humidity)" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="var(--color-humidity)" stopOpacity={0.1} />
//               </linearGradient>

//             </defs>

//             <CartesianGrid vertical={false} />

//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 return new Date(value).toLocaleTimeString("en-US", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               }}
//             />

//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) =>
//                     new Date(value).toLocaleTimeString("en-US")
//                   }
//                   indicator="dot"
//                 />
//               }
//             />

//             <Area
//               dataKey="temperature"
//               type="natural"
//               fill="url(#fillTemperature)"
//               stroke="var(--color-temperature)"
//               stackId="a"
//             />

//             <Area
//               dataKey="humidity"
//               type="natural"
//               fill="url(#fillHumidity)"
//               stroke="var(--color-humidity)"
//               stackId="a"
//             />
//             <Area
//               dataKey="soil_moisture"
//               type="natural"
//               fill="url(#fillSoilMoisture)"
//               stroke="var(--color-soil_moisture)"
//               stackId="a"
//             />

//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DashboardCharts() {
  const [farms, setFarms] = React.useState([]);
  const [selectedFarm, setSelectedFarm] = React.useState("");
  const [weatherData, setWeatherData] = React.useState([]);

  React.useEffect(() => {
    async function loadFarms() {
      const res = await fetch("/api/farms");
      const json = await res.json();
      setFarms(json);
    }

    loadFarms();
  }, []);

  React.useEffect(() => {
    if (!selectedFarm) return;

    async function loadWeather() {
  try {
    
    const postRes = await fetch(`/api/weather/${selectedFarm}`, { method: "POST" });
    if (!postRes.ok) {
      const err = await postRes.json().catch(() => ({ message: 'unknown' }));
      console.error("POST /api/weather error:", err);
      
    }

    const res = await fetch(`/api/weather/${selectedFarm}`);
    if (!res.ok) {
      console.error("GET /api/weather failed:", res.status);
      return;
    }
    const json = await res.json();

    const formatted = json.readings.map((w) => ({
      date: w.recordedAt,
      temperature: w.temperature,
      humidity: w.humidity,
      soil_moisture: w.soilMoisture,
    }));

    setWeatherData(formatted);
  } catch (e) {
    console.error("loadWeather failed:", e);
  }
}


    loadWeather();
  }, [selectedFarm]);

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "var(--chart-1)",
    },
    humidity: {
      label: "Humidity (%)",
      color: "var(--chart-2)",
    },
    soil_moisture: {
      label: "Soil moisture (%)",
      color: "var(--chart-3)",
    },
  };

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5 flex flex-col gap-3">
        <div className="grid gap-1">
          <CardTitle>Weather Monitoring Chart</CardTitle>
          <CardDescription>
            Select a farm to view stored weather data
          </CardDescription>
        </div>

        {/* FARM SELECT DROPDOWN */}
        <select
          className="border p-2 rounded-md text-sm w-64"
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
        >
          <option value="">Select Farm</option>
          {farms?.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!selectedFarm && (
          <p className="text-sm text-gray-500">Please select a farm above.</p>
        )}

        {selectedFarm && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={weatherData}>
              <defs>
                <linearGradient
                  id="fillTemperature"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient
                  id="fillSoilMoisture"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-soilMoisture)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-soilMoisture)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              ...
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleTimeString("en-US")
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#fillTemperature)"
                stroke="var(--color-temperature)"
              />
              <Area
                dataKey="humidity"
                type="natural"
                fill="url(#fillHumidity)"
                stroke="var(--color-humidity)"
              />
              <Area
                dataKey="soil_moisture"
                type="natural"
                fill="url(#fillSoilMoisture)"
                stroke="var(--color-soilMoisture)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
