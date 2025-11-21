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
  

 const slides = [
    {
      title: "Crop planning & protection",
      description:
        "Advisory - Smart pest and disease monitoring helps farmers reduce yield losses, optimize input use, and plan production cycles for higher, safer, and more predictable harvests.",
    },
    {
      title: "Farm monitoring",
      description:
        "Advisory - Real-time monitoring of soil, climate and input use is critical when farmers face 30% yield losses from pests and disease in tropical conditions.",
    },
    {
      title: "Food Safety",
      description:
        "Warning - In Kenya, 46% of food samples contain pesticide residues, with 11% exceeding safety limits — areas of high use show cancer rates above 2,000 per 100,000 people.",
    },
  ];


  const [currentSlide, setCurrentSlide] = useState(0);

 useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);
  
 

  if (status === "loading") return <p className="p-8">Loading session...</p>;
  if (status === "unauthenticated")
    return (
      <p className="p-8 text-red-500">
        You must be signed in to see this page.
      </p>
    );

    
  return (
    <main className=" px-4 flex min-h-screen w-full flex-col gap-4  ">
      <section className=" md:py-8 py-4 px-4 relative overflow-hidden rounded-md flex flex-col md:flex-row gap-8 ">
        <Decoration />
        {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          <h1 className=" text-white md:text-2xl tracking-wide font-bold relative z-20">
            {slide.title}
          </h1>
          <p className=" text-white mb-3 relative z-20">
            {slide.description}
          </p>

          
        </div>
      ))}
        

       
        
      </section>
      <div className="flex justify-center mt-2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-primary " : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      <section>
        <MainCalendar/>

      </section>

      <section>
        <DashboardCharts/>
      </section>

      
    </main>
  );
}
