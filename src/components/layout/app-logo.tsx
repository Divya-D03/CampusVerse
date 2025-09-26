'use client';

export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D946EF" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#84CC16" />
        </linearGradient>
        <linearGradient
          id="chevron-gradient"
          x1="50"
          y1="25"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* Atomic Orbits */}
      <path
        d="M20 75C20 55 80 55 80 75S20 95 20 75z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="40"
        ry="20"
        transform="rotate(-30 50 50)"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="40"
        ry="20"
        transform="rotate(30 50 50)"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
      />

      {/* Central Chevron */}
      <path
        d="M35 35 L50 50 L65 35 L50 25 Z"
        fill="url(#chevron-gradient)"
        opacity="0.8"
      />
      <path
        d="M35 50 L50 65 L65 50 L50 40 Z"
        fill="url(#chevron-gradient)"
      />
      <path
        d="M35 65 L50 80 L65 65 L50 55 Z"
        fill="url(#chevron-gradient)"
        opacity="0.6"
      />
      
      {/* Lightning Bolt */}
      <path
        d="M70 15 L55 40 L65 42 L50 60"
        stroke="url(#logo-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nodes and Cubes */}
      <circle cx="12" cy="62" r="3" fill="#A855F7" />
      <circle cx="88" cy="38" r="3" fill="#84CC16" />
      <circle cx="28" cy="23" r="2" fill="#F59E0B" />
      <circle cx="72" cy="77" r="2" fill="#D946EF" />

      <path d="M80 15 l 5 2 l 0 5 l -5 -2 z" fill="#F59E0B" opacity="0.8"/>
      <path d="M85 17 l 5 2 l -2 4 l -5 -2 z" fill="#F59E0B" />

      <path d="M55 10 l 4 1 l 0 4 l -4 -1 z" fill="#F59E0B" opacity="0.5"/>

    </svg>
  );
}