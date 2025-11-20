"use client";
import Cards from "@/components/dashboard/Cards";
import Decoration from "@/components/dashboard/Decoration";
import Farms from "@/components/tables/Farms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const Page = () => {
  const { data: session, status } = useSession();

  const [farms, setFarms] = useState([]);
  const [name, setName] = useState("");
  const [gps, setGps] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingFarm, setEditingFarm] = useState(null);

  const fetchFarms = useCallback(async () => {
    try {
      const res = await fetch("/api/farms");
      const data = await res.json();
      if (res.ok) setFarms(data);
      else {
        setError(data.error || "Failed to fetch farms");
        toast.error(data.error || "Failed to fetch farms");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch farms");
      toast.error("Failed to fetch farms");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchFarms();
  }, [status, fetchFarms]);

  // Create farm
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
        setFarms((prev) => [...prev, data]);
        setName("");
        setGps("");
        setLocation("");
        toast.success("Farm has been registered successfully!");
      } else {
        setError(data.error || "Failed to register farm");
        toast.error(data.error || "Failed to register farm");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to register farm");
      toast.error("Failed to register farm");
    } finally {
      setLoading(false);
    }
  }

  // Edit farm
  async function handleEditSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/farms/${editingFarm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingFarm.name,
          gps: editingFarm.gps,
          location: editingFarm.location,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFarms((prev) =>
          prev.map((f) => (f.id === editingFarm.id ? data : f))
        );
        setEditingFarm(null);
        toast.success("Farm updated successfully!");
      } else {
        toast.error(data.error || "Failed to update farm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update farm");
    } finally {
      setLoading(false);
    }
  }

  // Delete farm
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this farm?")) return;

    try {
      const res = await fetch(`/api/farms/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setFarms((prev) => prev.filter((f) => f.id !== id));
        toast.success("Farm deleted successfully!");
      } else {
        toast.error(data.error || "Failed to delete farm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete farm");
    }
  }

  return (
    <div className="px-4 w-full">
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
      <div className="flex flex-row justify-between p-2 w-full">
        <div className="flex flex-row items-center gap-6">
          <h1 className="font-bold tracking-wider">Farm Management</h1>
          <Button className="px-6 py-1 text-white">{farms.length}</Button>
        </div>
      </div>

      <p className="mt-2 tracking-wider text-sm font-light pl-2">
        Fill in the form below to register a farm.
      </p>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="w-full my-5 pl-2">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-8 p-2">
              <div className="space-y-1">
                <Label htmlFor="name">Farm Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter farm name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="gps">Gps Coordinates</Label>
                <Input
                  id="gps"
                  type="text"
                  value={gps}
                  onChange={(e) => setGps(e.target.value)}
                  placeholder="1.2921,36.8219"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="my-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Register Farm"}
            </Button>
          </CardFooter>
        </Card>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </form>

      {/* Farms Table */}
      <Farms
        farms={farms}
        onEdit={(farm) => setEditingFarm(farm)}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      {editingFarm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <Card className="p-6 w-[400px]">
            <h2 className="font-bold mb-4">Edit Farm</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <Input
                value={editingFarm.name}
                onChange={(e) =>
                  setEditingFarm({ ...editingFarm, name: e.target.value })
                }
                placeholder="Farm name"
              />
              <Input
                value={editingFarm.gps}
                onChange={(e) =>
                  setEditingFarm({ ...editingFarm, gps: e.target.value })
                }
                placeholder="GPS"
              />
              <Input
                value={editingFarm.location}
                onChange={(e) =>
                  setEditingFarm({ ...editingFarm, location: e.target.value })
                }
                placeholder="Location"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingFarm(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Page;
