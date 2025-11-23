import Link from "next/link";
import React from "react";

export function UserCard({ users }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.data.map((u: any) => (
        <div
          key={u._id}
          className="p-5 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] flex flex-col justify-between hover:shadow-lg transition"
        >
          <div className="space-y-2">
            <p className="text-sm text-dark-a0/60">Email</p>
            <h3 className="text-lg font-semibold text-dark-a0/70">{u.email}</h3>
            <p className="text-xs text-dark-a0/50">
              Created: {new Date(u.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-4">
            <Link
              href={`/admin/users/${u._id}`}
              className="inline-block px-4 py-2 rounded-lg bg-[var(--surface-a0)] border border-[var(--surface-a20)] text-[var(--surface-a50)] hover:border-[var(--primary-a20)] hover:text-[var(--primary-a20)] transition font-medium text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
