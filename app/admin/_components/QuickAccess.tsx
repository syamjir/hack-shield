import { QuickButton } from "./QuickButton";

export function QuickAccess() {
  return (
    <div className="p-6 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)]">
      <h3 className="text-lg font-semibold text-dark-a0/60">Quick Actions</h3>

      <div className="mt-4 space-y-4">
        <QuickButton label="Manage Users" href="/admin/users" />
        <QuickButton label="Open Chat Center" href="/admin/chats" />
        <QuickButton label="Admin Settings" href="/admin/settings" />
      </div>
    </div>
  );
}
