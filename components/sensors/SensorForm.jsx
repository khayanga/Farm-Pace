"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function SensorForm({ farms }) {
  const [form, setForm] = useState({
    description: "",
    farmCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Sensor created successfully!");
        setForm({ description: "", farmCode: "" });
      } else {
        toast.error(data.error || "Failed to create sensor");
      }
    } catch (err) {
      console.error(err);
      toast.error(" Error creating sensor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Add New Sensor
      </h2>

      <div className="mb-3">
        <label className="block text-sm mb-1 font-medium text-gray-600 dark:text-gray-300">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          className="w-full border rounded-lg p-2 bg-transparent text-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1 font-medium text-gray-600 dark:text-gray-300">
          Farm
        </label>
        <select
          name="farmCode"
          value={form.farmCode}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-transparent text-gray-800 dark:text-gray-100"
          required
        >
          <option value="">Select farm</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.code}>
              {farm.name} ({farm.code})
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        
      >
        {loading ? "Saving..." : "Add Sensor"}
      </Button>

      {message && (
        <p className="text-sm text-center mt-3 text-gray-700 dark:text-gray-200">
          {message}
        </p>
      )}
    </form>
  );
}
