"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ViewTaskModal({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
  userRole,
}) {
  if (!task) return null;

  const colorMap = {
    fertilizer: "bg-[#7C4A21]",
    foliar_fertilizer: "bg-[#A8D5BA] text-black",
    pesticide: "bg-red-500",
    fungicide: "bg-[#FDBA21]",
    irrigation: "bg-[#E2F1F4] text-black",
    harvesting: "bg-green-500 text-white",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {task.title}
            <Badge className={`${colorMap[task.taskType]} px-3 py-1`}>
              {task.taskType.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="font-semibold">Task Start Date:</p>
            <p>{new Date(task.startDate).toDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Task End Date:</p>
            <p>
              {task.endDate
                ? new Date(task.endDate).toDateString()
                : "No end date"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Farm:</p>
            <p>{task.farm?.code || "No farm assigned"}</p>
          </div>

          <div>
            <p className="font-semibold">Farm Crop:</p>
            <p>{task.farmCrop?.variety || "No crop assigned"}</p>
          </div>

          <div>
            <p className="font-semibold">Assigned To:</p>
            {task.assignedTo && task.assignedTo.length > 0 ? (
              task.assignedTo.map((a) => (
                <p key={a.id}>{a.user?.name || a.user_id}</p>
              ))
            ) : (
              <p>Not assigned</p>
            )}
          </div>

          <div>
            <p className="font-semibold">Description:</p>
            <p>{task.description || "No description provided"}</p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <div className="flex gap-2">
            <Button onClick={() => onEdit(task)}>Edit</Button>

            {userRole === "admin" && (
              <Button variant="destructive" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
