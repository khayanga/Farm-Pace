"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

export default function UsersPage() {
  const { farmId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("farmer");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    if (!farmId) return;
    try {
      const res = await fetch(`/api/farms/${farmId}/users`);
      const data = await res.json();
      if (res.ok || res.status === 200) setUsers(data);
      else toast.error(data.error || "Failed to fetch users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [farmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/farms/${farmId}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setName("");
        setEmail("");
        setRole("farmer");
        await fetchUsers(); 
        toast.success("User added successfully!");
      } else {
        toast.error(data.error || "Failed to add user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 w-full mx-auto space-y-6">
      <div className="flex flex-row justify-between p-2 w-full">
        <div className="flex flex-row items-center gap-6">
          <h1 className="font-bold tracking-wider text-primary">Manage Users</h1>
          <Button className="px-6 py-1 text-white">{users.length}</Button>
        </div>
      </div>

      <p className="mt-2 tracking-wider text-sm font-light pl-2">
        Fill in the form below to register users.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full my-5 pl-2">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-8 p-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  placeholder="Enter user's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="agronomist">Agronomist</SelectItem>
                    <SelectItem value="engineer">Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users Assigned to This Farm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users assigned yet.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
