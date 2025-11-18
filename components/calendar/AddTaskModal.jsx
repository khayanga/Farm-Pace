"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const TASK_TYPES = [
  "fertilizer",
  "foliar_fertilizer",
  "pesticide",
  "fungicide",
  "irrigation",
  "harvesting",
];

export default function AddTaskModal({ date, onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("");
  const [loading, setLoading] = useState(false);

  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");
  const [farmCrops, setFarmCrops] = useState([]);
  const [farmCropId, setFarmCropId] = useState("");
  const [farmUsers, setFarmUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  // Fetch farms
  useEffect(() => {
    fetch("/api/farms")
      .then((res) => res.json())
      .then(setFarms)
      .catch(console.error);
  }, []);

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

  if (!date) return null;

  function resetForm() {
    setTitle("");
    setDescription("");
    setTaskType("");
    setFarmId("");
    setFarmCropId("");
    setFarmCrops([]);
    setFarmUsers([]);
  }

  async function handleSave() {
    if (!title || !taskType || !farmId) {
      alert("Title, task type & farm are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          taskType,
          farm_id: farmId,
          farmCrop_id: farmCropId || null,
          startDate: date.toISOString(),
          assignedUsers: assignedUsers,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onAdded(data.task);
        resetForm();
        onClose();
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!date} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task for {date?.toDateString()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div className="space-y-1">
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="taskDescription">Description</Label>
            <Textarea
              id="taskDescription"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

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

          {farmUsers.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="assignedUsers">Assign Users</Label>
              {/* <Select  id="assignedUsers"
                multiple
                value={assignedUsers}
                onChange={(e) =>
                  setAssignedUsers(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Users" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {farmUsers.map((u, idx) => (
                    <SelectItem key={u.userId ?? idx} value={u.userId}>
                      {u.name} ({u.globalRole})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

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
        </div>

        <Button onClick={handleSave} disabled={loading} className="mt-4 w-full">
          {loading ? "Saving..." : "Save Task"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
