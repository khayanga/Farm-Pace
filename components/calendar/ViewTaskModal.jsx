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
import {
  CalendarDays,
  CalendarRange,
  MapPin,
  User,
  Sprout,
  AlignLeft,
} from "lucide-react";

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
    harvesting: "bg-lime-100  text-primary",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span>{task.title}</span>
            </span>

            <Badge variant="outline" className=" px-3 py-1 text-xs">
              {task.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          {/* Start Date */}
          <div className="p-3 rounded-xl  flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Start Date</span>
            </div>
            <p>{new Date(task.startDate).toDateString()}</p>
          </div>

          {/* End Date */}
          <div className="p-3 rounded-xl  flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <CalendarRange className="w-4 h-4" />
              <span>End Date</span>
            </div>
            <p>
              {task.endDate
                ? new Date(task.endDate).toDateString()
                : "No end date"}
            </p>
          </div>

          {/* Farm */}
          <div className="p-3 rounded-xl  flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Farm</span>
            </div>
            <p>{task.farm?.code || "No farm assigned"}</p>
          </div>

          {/* Farm Crop */}
          <div className="p-3 rounded-xl  flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <Sprout className="w-4 h-4" />
              <span>Farm Crop</span>
            </div>
            <p>{task.farmCrop?.variety || "No crop assigned"}</p>
          </div>

          {/* Assigned To */}
          <div className="p-3 rounded-xl  col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assigned To</span>
            </div>

            {task.assignedTo?.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1">
                {task.assignedTo.map((a) => (
                  <li key={a.id}>{a.user?.name || a.user_id}</li>
                ))}
              </ul>
            ) : (
              <p>Not assigned</p>
            )}
          </div>

          {/* Description */}
          <div className="p-3 rounded-xl  col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground">
              <AlignLeft className="w-4 h-4" />
              <span>Description</span>
            </div>
            <p>{task.description || "No description provided"}</p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between sticky bottom-0 bg-background pt-3">
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
