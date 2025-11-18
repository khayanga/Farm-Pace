"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const TASK_TYPES = [
  "fertilizer",
  "foliar_fertilizer",
  "pesticide",
  "fungicide",
  "irrigation",
  "harvesting",
];

export default function EditTaskModal({
  open,
  onClose,
  task,
  refresh,
  setTasks,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    taskType: "",
    startDate: "",
    endDate: "",
    farmCrop_id: null,
    farmId: "",
    assignedUsers: [],
  });

  const [farmUsers, setFarmUsers] = useState([]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        taskType: task.taskType || "",
        startDate: task.startDate ? task.startDate.split("T")[0] : "",
        endDate: task.endDate ? task.endDate.split("T")[0] : "",
        farmId: task.farm_id || "",
        assignedUsers:
          task.assignedTo?.map((a) => a.user?.userId).filter(Boolean) || [],
      });
    }
  }, [task]);

  useEffect(() => {
    if (!form.farmId) return;

    async function fetchUsers() {
      try {
        const usersRes = await fetch(`/api/users?farmId=${form.farmId}`);
        setFarmUsers(await usersRes.json());
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, [form.farmId]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Failed to update task");

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...data.task } : t))
      );

      toast.success("Task updated!");
      refresh();
      onClose();
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1">
            <Label>Task Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Task description"
            />
          </div>

          {/* Task Type */}
          <div className="space-y-1">
            <Label>Task Type</Label>
            <Select
              value={form.taskType}
              onValueChange={(value) => handleChange("taskType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Task Type" />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* {farmUsers.length > 0 && (
            <div className="space-y-1">
              <Label>Assign Users</Label>
              <Select
                multiple
                value={form.assignedUsers}
                onValueChange={(values) =>
                  handleChange("assignedUsers", values)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {form.assignedUsers.length > 0
                      ? form.assignedUsers
                          .map(
                            (id) => farmUsers.find((u) => u.userId === id)?.name
                          )
                          .filter(Boolean)
                          .join(", ")
                      : "Select Users"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                  {farmUsers.map((u) => (
                    <SelectItem key={u.userId} value={u.userId}>
                      {u.name} ({u.globalRole})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )} */}
          {farmUsers.length > 0 && (
            <div className="space-y-1">
              <Label>Assign User</Label>
              <Select
                value={form.assignedUsers[0] || ""}
                onValueChange={(val) => handleChange("assignedUsers", [val])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                  {farmUsers.map((u) => (
                    <SelectItem key={u.userId} value={u.userId}>
                      {u.name} ({u.globalRole})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate || ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <Button onClick={handleUpdate} className="w-full">
            Update Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
