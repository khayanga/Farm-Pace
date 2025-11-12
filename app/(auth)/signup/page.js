"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/ui/AuthForm";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState(null);

  // receives formData from AuthForm
  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful! Please log in.");
      router.push("/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" onSubmit={handleSubmit} />
        {error && (
          <p className="text-red-500 text-center text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
