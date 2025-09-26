
'use client';

export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        d="M14 25.6667C20.4434 25.6667 25.6667 20.4434 25.6667 14C25.6667 7.55666 20.4434 2.33334 14 2.33334C7.55666 2.33334 2.33334 7.55666 2.33334 14C2.33334 20.4434 7.55666 25.6667 14 25.6667Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 16.3333L14 12.8333L17.5 16.3333"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
       <path
        d="M10.5 11.6667L14 8.16666L17.5 11.6667"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
       <path
        d="M12.8333 2.33331C12.8333 5.42498 15.175 7.85998 18.2283 8.13181"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
       <path
        d="M2.46167 11.0833C5.515 11.3551 7.85667 13.79 7.85667 16.8817"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

