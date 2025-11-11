"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword !== confirm) {
      setLoading(false);
      return setMessage("❌ New passwords do not match.");
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      return setMessage(`❌ ${data.error}`);
    }

    setMessage("✅ Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded border shadow space-y-4">
      <h1 className="text-xl font-bold">Change Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          required
          className="border px-3 py-2 w-full rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          required
          className="border px-3 py-2 w-full rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          required
          className="border px-3 py-2 w-full rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="text-center text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}
