"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const TASK_TYPES = [
  "fertilizer",
  "foliar_fertilizer",
  "pesticide",
  "fungicide",
  "irrigation",
  "harvesting",
];

const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"];

export default function AddTaskModal({ date, onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("");
  const [farmId, setFarmId] = useState("");
  const [farmCropId, setFarmCropId] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [recurrence, setRecurrence] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState(1);
  const [time, setTime] = useState(date?.toISOString().slice(11, 16) || "08:00"); 
  const [loading, setLoading] = useState(false);

  const [farms, setFarms] = useState([]);
  const [farmCrops, setFarmCrops] = useState([]);
  const [farmUsers, setFarmUsers] = useState([]);

  // Fetch farms
  useEffect(() => {
    fetch("/api/farms")
      .then((res) => res.json())
      .then(setFarms)
      .catch(console.error);
  }, []);

  // Fetch crops & users when farm changes
  useEffect(() => {
    if (!farmId) return;

    async function fetchCrops() {
      const res = await fetch(`/api/farm-crops?farmId=${farmId}`);
      const data = await res.json();
      setFarmCrops(data);
    }
    async function fetchUsers() {
      const res = await fetch(`/api/users?farmId=${farmId}`);
      const data = await res.json();
      setFarmUsers(data);
    }

    fetchCrops();
    fetchUsers();
  }, [farmId]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setTaskType("");
    setFarmId("");
    setFarmCropId("");
    setFarmCrops([]);
    setFarmUsers([]);
    setAssignedUsers([]);
    setRecurrence(false);
    setFrequency("daily");
    setInterval(1);
    setTime(date?.toISOString().slice(11, 16) || "08:00");
  }

  async function handleSave() {
    if (!title || !taskType || !farmId) {
      alert("Title, task type & farm are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        taskType,
        farm_id: farmId,
        farmCrop_id: farmCropId || null,
        startDate: date.toISOString(),
        assignedUsers,
      };

      if (recurrence) {
        payload.recurrence = {
          frequency,
          interval: parseInt(interval, 10),
          time,
        };
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onAdded(data.task || data.recurringTask);
        resetForm();
        onClose();
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!date) return null;

  return (
      <Dialog open={!!date} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task for {date.toDateString()}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-4rem)] p-4">
           <div className="space-y-4 mt-3">
          {/* Task Title */}
          <div className="space-y-1 p-1">
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="taskDescription">Description</Label>
            <Textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          {/* Task Type */}
          <div className="space-y-1">
            <Label htmlFor="taskType">Task Type</Label>
            <Select value={taskType} onValueChange={setTaskType}>
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

          {/* Farm */}
          <div className="space-y-1">
            <Label htmlFor="farmSelect">Farm</Label>
            <Select value={farmId} onValueChange={setFarmId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Farm" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {farms.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.code} - {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Farm Crop */}
          {farmCrops.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="farmCropSelect">Farm Crop (optional)</Label>
              <Select value={farmCropId} onValueChange={setFarmCropId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Crop" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {farmCrops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.template?.name} ({crop.variety})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Assigned Users */}
          {farmUsers.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="assignedUsers">Assign User</Label>
              <Select
                value={assignedUsers[0] || ""}
                onValueChange={(val) => setAssignedUsers([val])}
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

          {/* Recurrence toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurrenceToggle"
              checked={recurrence}
              onChange={(e) => setRecurrence(e.target.checked)}
            />
            <Label htmlFor="recurrenceToggle">Recurring Task?</Label>
          </div>

          {/* Recurrence inputs */}
          {recurrence && (
            <div className="space-y-2 border p-2 rounded-md ">
              <div className="space-y-1">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="interval">Interval (every n {frequency})</Label>
                <Input
                  type="number"
                  id="interval"
                  min={1}
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? "Saving..." : "Save Task"}
        </Button>
        </ScrollArea>
        

       
      </DialogContent>
    </Dialog>
    
    
  );
}