export function StatCard({
  label,
  value,
  footer,
  valueClass,
}: {
  label: string;
  value: string;
  footer?: string;
  valueClass?: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)]">
      <p className="text-sm text-dark-a0/60">{label}</p>
      <h3
        className={`text-3xl font-bold mt-2 ${
          valueClass || "text-[var(--primary-a20)]"
        }`}
      >
        {value}
      </h3>
      {footer && <p className="text-xs mt-1 text-dark-a0/50">{footer}</p>}
    </div>
  );
}
