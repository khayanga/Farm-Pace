"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export default function EditTaskModal({ open, onClose, task, refresh, setTasks }) {
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
        assignedUsers: task.assignedTo?.map(a => a.user?.userId).filter(Boolean) || [],
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
        console.error("Failed to fetch crops/users", err);
      }
    }
    fetchUsers();
  }, [form.farmId]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update task");
        return;
      }
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, ...data.task } : t)));

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={form.title}
            onChange={e => handleChange("title", e.target.value)}
            placeholder="Task title"
          />

          <Textarea
            value={form.description}
            onChange={e => handleChange("description", e.target.value)}
            placeholder="Task description"
          />

          <select
            className="border p-2 w-full rounded"
            value={form.taskType}
            onChange={e => handleChange("taskType", e.target.value)}
          >
            <option value="">Select Task Type</option>
            {TASK_TYPES.map(t => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>

          {/* Assigned Users */}
          {farmUsers.length > 0 && (
            <select
              multiple
              value={form.assignedUsers}
              onChange={e =>
                handleChange(
                  "assignedUsers",
                  Array.from(e.target.selectedOptions, o => o.value)
                )
              }
              className="border p-2 w-full rounded"
            >
              {farmUsers.map(u => (
                <option key={u.userId} value={u.userId}>
                  {u.name} ({u.globalRole})
                </option>
              ))}
            </select>
          )}

          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />

          <Input
            type="date"
            value={form.endDate || ""}
            onChange={e => handleChange("endDate", e.target.value)}
          />

          <Button onClick={handleUpdate} className="w-full">
            Update Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
