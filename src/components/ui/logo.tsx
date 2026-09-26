export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={className}
    >
      <rect width="28" height="28" rx="6" fill="#0f0f1a" />
      <line
        x1="3"
        y1="10"
        x2="11"
        y2="10"
        stroke="#5DCAA5"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="3"
        y1="14"
        x2="9"
        y2="14"
        stroke="#5DCAA5"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="3"
        y1="18"
        x2="10"
        y2="18"
        stroke="#5DCAA5"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.18"
      />
      <polyline
        points="10,18 13,18 16,9 19,27 22,12 25,20 26,16 27,16"
        fill="none"
        stroke="#5DCAA5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="9" r="2" fill="#5DCAA5" />
      <circle cx="25" cy="20" r="2" fill="#1D9E75" />
    </svg>
  );
}
