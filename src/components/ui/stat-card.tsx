interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  sub?: string;
}

export function StatCard({ label, value, unit, color = "#5DCAA5", sub }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden card-hover"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px] tracking-widest uppercase mb-2.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="font-serif text-[28px] font-bold leading-none" style={{ color: "var(--text)" }}>
        {value}
        {unit && (
          <span className="text-[13px] font-normal ml-1" style={{ color: "var(--text-dim)" }}>
            {unit}
          </span>
        )}
      </div>
      {sub && <div className="text-[11px] mt-2" style={{ color: "var(--text-dim)" }}>{sub}</div>}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `${color}70` }} />
    </div>
  );
}
