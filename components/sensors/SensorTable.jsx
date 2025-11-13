"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SensorTable() {
  const router = useRouter()
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
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Registered Sensors
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Farm Name</th>
              <th className="p-2">Farm Code</th>
              <th className="p-2">Location</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2 font-mono">{s.code}</td>
                <td className="p-2">{s.farm?.name}</td>
                <td className="p-2">{s.farm?.code}</td>
                 <td className="p-2">{s.farm?.location}</td>
                  <td className="p-2">
                  <button
                    onClick={() => router.push(`/sensors/${s.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
