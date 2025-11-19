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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DashboardCharts() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [farms, setFarms] = React.useState([]);
  const [selectedFarm, setSelectedFarm] = React.useState("");
  const [weatherData, setWeatherData] = React.useState([]);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user");
        const json = await res.json();
        setCurrentUser(json.user);

        if (json.user.role === "admin") {
          setSelectedFarm("");
        } else {
          setSelectedFarm(json.user.farm?.id || "");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    loadUser();
  }, []);

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

  if (!currentUser) {
    return null;
  }

  return (
    <Card className="pt-0 mb-6">
      <CardHeader className="border-b py-5 flex flex-col gap-3">
        <div className="grid gap-1">
          <CardTitle>Weather Monitoring Chart</CardTitle>
          <CardDescription>
            {currentUser?.role === "admin"
              ? "Select a farm to view stored weather data"
              : "Viewing weather data for your farm"}
          </CardDescription>
        </div>

       
       <div className="flex justify-end w-full">
         {currentUser?.role === "admin" && (
          <Select
            value={selectedFarm}
            onValueChange={(value) => setSelectedFarm(value)}
          >
            <SelectTrigger className="w-64 border p-2 rounded-md text-sm">
              <SelectValue placeholder="Select Farm" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

       </div>
       
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!selectedFarm && currentUser.role === "admin" && (
          <p className="text-sm text-muted-foreground">
            Please select a farm to view the analytics above.
          </p>
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
