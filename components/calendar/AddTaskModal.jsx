"use client";

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
          assignedUsers: assignedUsers
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
          <DialogTitle>Add Task for {date.toDateString()}</DialogTitle>
        </DialogHeader>

               <div className="space-y-4 mt-3">
          {/* Task Title */}
          <div>
            <label htmlFor="taskTitle" className="block font-medium mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="taskTitle"
              className="border p-2 w-full rounded"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="taskDescription" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="taskDescription"
              className="border p-2 w-full rounded"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Task Type */}
          <div>
            <label htmlFor="taskType" className="block font-medium mb-1">
              Task Type <span className="text-red-500">*</span>
            </label>
            <select
              id="taskType"
              className="border p-2 w-full rounded"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value="">Select Task Type</option>
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Farm Dropdown */}
          <div>
            <label htmlFor="farmSelect" className="block font-medium mb-1">
              Farm <span className="text-red-500">*</span>
            </label>
            <select
              id="farmSelect"
              className="border p-2 w-full rounded"
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
            >
              <option value="">Select Farm</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} - {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Farm Crop Dropdown */}
          {farmCrops.length > 0 && (
            <div>
              <label htmlFor="farmCropSelect" className="block font-medium mb-1">
                Farm Crop (optional)
              </label>
              <select
                id="farmCropSelect"
                className="border p-2 w-full rounded"
                value={farmCropId}
                onChange={(e) => setFarmCropId(e.target.value)}
              >
                <option value="">Select Crop</option>
                {farmCrops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.template?.name} ({crop.variety})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assigned Users */}
          {farmUsers.length > 0 && (
            <div>
              <label htmlFor="assignedUsers" className="block font-medium mb-1">
                Assign Users
              </label>
              <select
                id="assignedUsers"
                multiple
                value={assignedUsers}
                onChange={(e) =>
                  setAssignedUsers(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="border p-2 w-full rounded"
              >
                {farmUsers.map((u, idx) => (
                  <option key={u.userId ?? idx} value={u.userId}>
                    {u.name} ({u.globalRole})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Save Task"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
