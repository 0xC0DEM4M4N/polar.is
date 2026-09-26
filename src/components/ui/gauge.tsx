"use client";

interface GaugeProps {
  value: number;
  max?: number;
}

export function Gauge({ value, max = 100 }: GaugeProps) {
  const pct = Math.min(1, Math.max(0, value / max));
  const rotate = -135 + pct * 270;

  return (
    <div className="gauge-wrap">
      <div className="gauge-arc" />
      <div
        className="gauge-fill"
        style={{ transform: `rotate(${rotate}deg)` }}
      />
      <div className="gauge-num">{value}</div>
    </div>
  );
}
