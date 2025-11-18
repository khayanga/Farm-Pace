"use client";

import { Button } from "@/components/ui/button";
import Cards from "@/components/dashboard/Cards";
import Decoration from "@/components/dashboard/Decoration";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import MainCalendar from "@/components/calendar/MainCalendar";


export default function HomePage() {
  const { data: session, status } = useSession();
  const [farms, setFarms] = useState([]);
  const [name, setName] = useState("");
  const [gps, setGps] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  
 

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
        <MainCalendar/>

      </section>

      <section>
        <DashboardCharts/>
      </section>

      
    </main>
  );
}
