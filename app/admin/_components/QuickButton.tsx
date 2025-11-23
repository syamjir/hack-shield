export function QuickButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg bg-[var(--surface-a0)] border border-[var(--surface-a20)] hover:border-[var(--primary-a20)] transition text-dark-a0/50"
    >
      ➜ {label}
    </a>
  );
}
