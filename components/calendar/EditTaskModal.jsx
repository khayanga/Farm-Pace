// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { ScrollArea } from "@/components/ui/scroll-area";

// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// const TASK_TYPES = [
//   "fertilizer",
//   "foliar_fertilizer",
//   "pesticide",
//   "fungicide",
//   "irrigation",
//   "harvesting",
// ];

// export default function EditTaskModal({
//   open,
//   onClose,
//   task,
//   refresh,
//   setTasks,
// }) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     taskType: "",
//     startDate: "",
//     endDate: "",
//     farmCrop_id: null,
//     farmId: "",
//     status: "pending",
//     assignedUsers: [],
//   });

//   const [farmUsers, setFarmUsers] = useState([]);

//   useEffect(() => {
//     if (task) {
//       setForm({
//         title: task.title || "",
//         description: task.description || "",
//         taskType: task.taskType || "",
//         startDate: task.startDate ? task.startDate.split("T")[0] : "",
//         endDate: task.endDate ? task.endDate.split("T")[0] : "",
//         farmId: task.farm_id || "",
//         status: task.status || "pending",
//         assignedUsers:
//           task.assignedTo?.map((a) => a.user?.userId).filter(Boolean) || [],
//       });
//     }
//   }, [task]);

//   useEffect(() => {
//     if (!form.farmId) return;

//     async function fetchUsers() {
//       try {
//         const usersRes = await fetch(`/api/users?farmId=${form.farmId}`);
//         setFarmUsers(await usersRes.json());
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     }
//     fetchUsers();
//   }, [form.farmId]);

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`/api/tasks/${task.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) return toast.error(data.error || "Failed to update task");

//       setTasks((prev) =>
//         prev.map((t) => (t.id === task.id ? { ...t, ...data.task } : t))
//       );

//       toast.success("Task updated!");
//       refresh();
//       onClose();
//     } catch (err) {
//       toast.error("Something went wrong.");
//     }
//   };

//   if (!task) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Task</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-2">
//           {/* Title */}
//           <div className="space-y-1">
//             <Label>Task Title</Label>
//             <Input
//               value={form.title}
//               onChange={(e) => handleChange("title", e.target.value)}
//               placeholder="Task title"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-1">
//             <Label>Description</Label>
//             <Textarea
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               placeholder="Task description"
//             />
//           </div>

//           <div className="space-y-1">
//             <Label>Status</Label>
//             <Select
//               value={form.status}
//               onValueChange={(value) => handleChange("status", value)}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="in_progress">In Progress</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//                 <SelectItem value="skipped">Skipped</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Task Type */}
//           <div className="space-y-1">
//             <Label>Task Type</Label>
//             <Select
//               value={form.taskType}
//               onValueChange={(value) => handleChange("taskType", value)}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Task Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {TASK_TYPES.map((t) => (
//                   <SelectItem key={t} value={t}>
//                     {t.replace("_", " ")}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {farmUsers.length > 0 && (
//             <div className="space-y-1">
//               <Label>Assign User</Label>
//               <Select
//                 value={form.assignedUsers[0] || ""}
//                 onValueChange={(val) => handleChange("assignedUsers", [val])}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select User" />
//                 </SelectTrigger>

//                 <SelectContent className="max-h-60 overflow-y-auto">
//                   {farmUsers.map((u) => (
//                     <SelectItem key={u.userId} value={u.userId}>
//                       {u.name} ({u.globalRole})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Dates */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <Label>Start Date</Label>
//               <Input
//                 type="date"
//                 value={form.startDate}
//                 onChange={(e) => handleChange("startDate", e.target.value)}
//               />
//             </div>

//             <div className="space-y-1">
//               <Label>End Date</Label>
//               <Input
//                 type="date"
//                 value={form.endDate || ""}
//                 onChange={(e) => handleChange("endDate", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <Button onClick={handleUpdate} className="w-full">
//             Update Task
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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

import { useState, useEffect, useMemo } from "react";
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
  const isRecurring = useMemo(
    () => task?.isRecurring === true || String(task?.id).startsWith("rec-"),
    [task]
  );

 const apiId = useMemo(() => {
  if (!task?.id) return null;

  let rawId = String(task.id);

  // ✅ Remove "task-" prefix if it exists
  if (rawId.startsWith("task-")) {
    rawId = rawId.replace("task-", "");
  }

  // ✅ Add "rec-" prefix only when needed
  if (task.isRecurring && !rawId.startsWith("rec-")) {
    rawId = `rec-${rawId}`;
  }

  return rawId;
}, [task]);


  const [form, setForm] = useState({
    title: "",
    description: "",
    taskType: "",
    startDate: "",
    endDate: "",
    farmCrop_id: null,
    farmId: "",
    status: "pending",
    assignedUsers: [],
  });

  const [farmUsers, setFarmUsers] = useState([]);

  useEffect(() => {
    if (!task) return;

    setForm({
      title: task.title || "",
      description: task.description || "",
      taskType: task.taskType || "",
      startDate: task.startDate ? task.startDate.split("T")[0] : "",
      endDate: task.endDate ? task.endDate.split("T")[0] : "",
      farmId: task.farm_id || "",
      status: task.status || "pending",

      // ✅ Only load assigned users for one-off tasks
      assignedUsers: !isRecurring
        ? task.assignedTo?.map((a) => a.user?.userId).filter(Boolean) || []
        : [],
    });
  }, [task, isRecurring]);

  // --------------------------------------------------
  // ✅ Fetch users (only for single tasks)
  // --------------------------------------------------
  useEffect(() => {
    if (!form.farmId || isRecurring) return;

    async function fetchUsers() {
      try {
        const usersRes = await fetch(`/api/users?farmId=${form.farmId}`);
        setFarmUsers(await usersRes.json());
      } catch {
        toast.error("Failed to load users");
      }
    }

    fetchUsers();
  }, [form.farmId, isRecurring]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // --------------------------------------------------
  // ✅ Unified Update Handler
  // --------------------------------------------------
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/tasks/${apiId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.error || "Failed to update task");
      }

      // ✅ Get returned model (task OR recurringTask)
      const updatedTask = data.task || data.recurringTask;

      if (!updatedTask) {
        throw new Error("No updated task returned");
      }

      setTasks((prev) =>
        prev.map((t) =>
          String(t.id) === String(task.id) ? { ...t, ...updatedTask } : t
        )
      );

      toast.success("Task updated");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task {isRecurring && "(Recurring)"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1">
            <Label>Task Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => handleChange("status", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Type */}
          <div className="space-y-1">
            <Label>Task Type</Label>
            <Select
              value={form.taskType}
              onValueChange={(v) => handleChange("taskType", v)}
            >
              <SelectTrigger>
                <SelectValue />
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

          {/* ✅ Assignment only for one-off tasks */}
          {!isRecurring && farmUsers.length > 0 && (
            <div className="space-y-1">
              <Label>Assign User</Label>
              <Select
                value={form.assignedUsers[0] || ""}
                onValueChange={(val) => handleChange("assignedUsers", [val])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
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
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            <div>
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
