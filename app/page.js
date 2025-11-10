"use client";

import { Button } from "@/components/ui/button";
import Cards from "@/components/dashboard/Cards";
import Decoration from "@/components/dashboard/Decoration";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [farms, setFarms] = useState([]);
  const [name, setName] = useState("");
  const [gps, setGps] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") fetchFarms();
  }, [status]);

  async function fetchFarms() {
    try {
      const res = await fetch("/api/farms");
      const data = await res.json();

      if (res.ok) setFarms(data);
      else setError(data.error || "Failed to fetch farms");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch farms");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gps, location }),
      });

      const data = await res.json();
      if (res.ok) {
        setFarms([...farms, data]);
        setName("");
        setGps("");
        setLocation("");
      } else {
        setError(data.error || "Failed to register farm");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to register farm");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") return <p className="p-8">Loading session...</p>;
  if (status === "unauthenticated")
    return (
      <p className="p-8 text-red-500">
        You must be signed in to see this page.
      </p>
    );

  return (
    <main className=" px-4 flex min-h-screen w-full flex-col gap-4  ">
      <section className=" md:py-8 py-4 px-4 relative overflow-hidden rounded-md">
        <Decoration />
        <h1 className="dark:text-gray-800 text-white md:text-2xl tracking-wide font-bold relative z-20">
          Welcome back {session.user.name}
        </h1>

        <p className="dark:text-gray-700 text-white  mb-3 relative z-20">
          This is your starting point for managing and monitoring your farm.
        </p>

        <Cards />
        
      </section>

      <section>
        <DashboardCharts/>
      </section>

      
    </main>
  );
}
