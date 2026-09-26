export function fmtHours(decimal: number): string {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function fmtNumber(n: number): string {
  return n.toLocaleString();
}

export function decToHHMM(dec: number): string {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function avg(arr: number[]): number {
  const v = arr.filter((x) => x != null && !isNaN(x));
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function getDays(range: number, end?: string): string[] {
  const days: string[] = [];
  const e = end ? new Date(end) : new Date();
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(e);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}
