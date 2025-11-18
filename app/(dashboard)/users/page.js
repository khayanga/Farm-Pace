"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("farmer");
  const [farmCode, setFarmCode] = useState("");
  const [farms, setFarms] = useState([])

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };
  const fetchFarms = async () => {
    try {
      const res = await fetch("/api/farms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch farms");
      setFarms(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch farms");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFarms()
    
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, farmCode }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("User created and assigned to farm!");
        setName("");
        setEmail("");
        setRole("farmer");
        setFarmCode("");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 w-full mx-auto space-y-6">
      <h1 className="font-bold tracking-wider text-primary">Manage Users</h1>

      {/* Form */}
      <Card>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-wrap gap-4 ">
              <div className="flex-1 space-y-1">
                <Label>Name</Label>
                <Input
                  placeholder="Enter user's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="agronomist">Agronomist</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <Label>Farm Code</Label>
                <Select value={farmCode} onValueChange={setFarmCode}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.code} value={farm.code}>
                        {farm.farmName} {farm.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>

                <TableHead>Farm Name</TableHead>
                <TableHead>Farm Location</TableHead>
                <TableHead>Farm Code</TableHead>
                <TableHead>Farm Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const farms =
                    user.farms && user.farms.length > 0 ? user.farms : [null];
                  return farms.map((farm, index) => (
                    <TableRow key={`${user.id || user.userId}-${index}`}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{farm?.farmName || "-"}</TableCell>
                      <TableCell>{farm?.farmLocation || "-"}</TableCell>
                      <TableCell>{farm?.farmCode || "-"}</TableCell>
                      <TableCell>{farm?.role || "-"}</TableCell>
                    </TableRow>
                  ));
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
