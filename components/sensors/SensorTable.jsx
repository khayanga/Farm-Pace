"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SensorTable() {
  const router = useRouter();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSensors() {
      try {
        const res = await fetch("/api/sensors", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setSensors(data);
      } catch (err) {
        console.error("Failed to load sensors", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSensors();
  }, []);

  if (loading) return <p>Loading sensors...</p>;

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Registered Sensors
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Farm Name</TableHead>
            <TableHead>Farm Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sensors.map((s) => (
            <TableRow
              key={s.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableCell className="font-mono">{s.code}</TableCell>
              <TableCell>{s.farm?.name || "-"}</TableCell>
              <TableCell>{s.farm?.code || "-"}</TableCell>
              <TableCell>{s.farm?.location || "-"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => router.push(`/sensors/${s.id}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {sensors.length === 0 && (
          <TableCaption>No sensors registered yet.</TableCaption>
        )}
      </Table>
    </div>
  );
}
