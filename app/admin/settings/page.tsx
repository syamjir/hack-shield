"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("PassKeeper");
  const [defaultRole, setDefaultRole] = useState("User");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-10 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--surface-a50)]">
          Admin Settings
        </h2>
        <p className="text-[var(--surface-a40)] mt-1">
          Configure system preferences, manage roles, and update your profile.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-[var(--surface-a50)]">
          Profile Settings
        </h3>
        <div className="flex flex-col space-y-3">
          <label className="text-[var(--surface-a40)] text-sm">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="p-3 rounded-lg border border-[var(--surface-a20)] bg-[var(--surface-a0)] text-[var(--surface-a50)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-a20)]"
          />
        </div>
      </div>

      {/* Role Management */}
      <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-[var(--surface-a50)]">
          Default User Role
        </h3>
        <select
          value={defaultRole}
          onChange={(e) => setDefaultRole(e.target.value)}
          className="p-3 rounded-lg border border-[var(--surface-a20)] bg-[var(--surface-a0)] text-[var(--surface-a50)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-a20)]"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* System Preferences */}
      <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-[var(--surface-a50)]">
          System Preferences
        </h3>
        <div className="flex flex-col space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-[var(--primary-a20)]" />
            Enable maintenance mode
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-[var(--primary-a20)]" />
            Enable user registration
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
