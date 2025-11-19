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
import { useEffect, useState } from "react";
import AddNotes from "./AddNotes";

export default function ViewTaskModal({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
  userRole,
}) {
  const colorMap = {
    fertilizer: "bg-[#7C4A21]",
    foliar_fertilizer: "bg-[#A8D5BA] text-black",
    pesticide: "bg-red-500",
    fungicide: "bg-[#FDBA21]",
    irrigation: "bg-[#E2F1F4] text-black",
    harvesting: "bg-lime-100  text-primary",
  };

  const statusStyles = {
    pending: "bg-green-100 text-green-700 border-green-300",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300",
    completed: "bg-amber-100 text-amber-700 border-amber-300",
    skipped: "bg-red-100 text-red-700 border-red-300",
  };

  const statusDot = {
    pending: "bg-green-500",
    in_progress: "bg-blue-500",
    completed: "bg-amber-600",
    skipped: "bg-red-500",
  };

  const [notes, setNotes] = useState(task?.notes || []);

  const [openNoteModal, setOpenNoteModal] = useState(false);

  useEffect(() => {
  if (open && task?.notes) {
    setNotes(task.notes);
  }
}, [open, task]);

const handleNoteAdded = (newNote) => {
  setNotes((prev) => [...prev, newNote]);
};

const handleDelete = () => {
  if (!task) return;

  const confirmDelete = confirm(
    `Are you sure you want to delete the task "${task.title}"?`
  );
  if (!confirmDelete) return;

  onDelete(task.id); 
  onClose(); 
};
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold flex items-center gap-2">
              <span>{task.title}</span>
            </span>

            <Badge
              variant="outline"
              className={`px-3 py-1 text-xs flex items-center gap-2 rounded-full ${
                statusStyles[task.status]
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${statusDot[task.status]}`}
              ></span>
              {task.status.replace("_", " ")}
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
        <div className="mt-2 p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold">Notes</h3>

              {["admin", "agronomist"].includes(userRole) && (
                <Button size="sm" onClick={() => setOpenNoteModal(true)}>
                  Add Note
                </Button>
              )}
            </div>

            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notes added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border p-3 rounded-lg bg-muted/30"
                  >
                    <p className="text-sm">{note.note}</p>

                    {note.imageUrl && (
                      <img
                        src={note.imageUrl}
                        alt="note"
                        className="mt-2 rounded-md w-32 h-32 object-cover"
                      />
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      By {note.user?.name || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <AddNotes
              open={openNoteModal}
              onClose={() => setOpenNoteModal(false)}
              taskId={task.id}
              onNoteAdded={handleNoteAdded}
            />
          </div>

        <DialogFooter className="mt-6 flex justify-between sticky bottom-0 bg-background pt-3">
          

          <div className="flex gap-2">
            <Button onClick={() => onEdit(task)}>Edit</Button>
            {userRole === "admin" && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
