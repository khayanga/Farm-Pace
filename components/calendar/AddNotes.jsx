"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddNotes({ open, onClose, taskId, onNoteAdded }) {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   setLoading(true);

  //   let imageUrl = null;

  //   if (image) {
  //     const form = new FormData();
  //     form.append("file", image);
  //     form.append("upload_preset", "task_images");

  //     const res = await fetch(
  //       "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
  //       { method: "POST", body: form }
  //     );

  //     const data = await res.json();
  //     imageUrl = data.secure_url;
  //   }

  //   await fetch(`/api/tasks/${taskId}/notes`, {
  //     method: "POST",
  //     body: JSON.stringify({ note, imageUrl }),
  //   });

  //   setLoading(false);
  //   onClose();
  //   setNote("");
  //   setImage(null);
  //   onNoteAdded();
  // };


  const handleSubmit = async () => {
  setLoading(true);

  let imageUrl = null;

  if (image) {
    const form = new FormData();
    form.append("file", image);
    form.append("upload_preset", "task_images");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      { method: "POST", body: form }
    );

    const data = await res.json();
    imageUrl = data.secure_url;
  }

  // POST to your API
  const res = await fetch(`/api/tasks/${taskId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note, imageUrl }),
  });

  const created = await res.json();

  setLoading(false);
  onClose();
  setNote("");
  setImage(null);

  // Pass the actual note object
  if (created?.note) {
    onNoteAdded(created.note);
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="Write your notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
