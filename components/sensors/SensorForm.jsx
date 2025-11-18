"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SensorForm({ farms }) {
  const [form, setForm] = useState({
    description: "",
    farmCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      toast.error("Error creating sensor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Add New Sensor
      </h2>

      {/* Description */}
      <div className="space-y-1">
        <Label>Description</Label>
        <Input
          type="text"
          placeholder="Optional description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* Farm Select */}
      <div className="space-y-1">
        <Label>Farm</Label>
        <Select
          value={form.farmCode}
          onValueChange={(value) => handleChange("farmCode", value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select farm" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {farms.map((farm) => (
              <SelectItem key={farm.id} value={farm.code}>
                {farm.name} ({farm.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Add Sensor"}
      </Button>
    </form>
  );
}
