// The Orbit Development mascot mark (Android-robot head + orbital ring + planet).
// Pure SVG so it's crisp at any size and usable as favicon / inline logo.
export default function Emblem({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-380 -380 760 760" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="e_rg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1e6bff" />
          <stop offset=".5" stopColor="#5a2bff" />
          <stop offset="1" stopColor="#b23bff" />
        </linearGradient>
        <linearGradient id="e_rg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a2bff" />
          <stop offset="1" stopColor="#1e6bff" />
        </linearGradient>
        <linearGradient id="e_mt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eafcff" />
          <stop offset=".18" stopColor="#7be04f" />
          <stop offset=".55" stopColor="#3fa32a" />
          <stop offset="1" stopColor="#1c5c15" />
        </linearGradient>
        <linearGradient id="e_hr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#37c6ff" />
          <stop offset="1" stopColor="#a03bff" />
        </linearGradient>
        <linearGradient id="e_pl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a5bff" />
          <stop offset="1" stopColor="#2a1b6e" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="0" rx="330" ry="120" fill="none" stroke="url(#e_rg)" strokeWidth="26" transform="rotate(-18)" strokeLinecap="round" strokeDasharray="620 900" />
      <path d="M -60 -250 A 250 250 0 0 0 -250 60" fill="none" stroke="url(#e_rg2)" strokeWidth="52" strokeLinecap="round" />
      <path d="M 60 -250 A 250 250 0 0 1 250 60" fill="none" stroke="url(#e_rg)" strokeWidth="52" strokeLinecap="round" />
      <path d="M -215 150 A 250 250 0 0 0 -30 245" fill="none" stroke="url(#e_rg2)" strokeWidth="52" strokeLinecap="round" />
      <path d="M 215 150 A 250 250 0 0 1 40 245" fill="none" stroke="url(#e_rg)" strokeWidth="52" strokeLinecap="round" />
      <path d="M -150 30 A 150 150 0 0 1 150 30 L 150 120 A 30 30 0 0 1 120 150 L -120 150 A 30 30 0 0 1 -150 120 Z" fill="url(#e_mt)" stroke="url(#e_hr)" strokeWidth="7" />
      <path d="M -120 -20 A 120 120 0 0 1 120 -20" fill="none" stroke="#eaffea" strokeWidth="10" opacity=".55" strokeLinecap="round" />
      <g stroke="url(#e_hr)" strokeWidth="10" strokeLinecap="round">
        <line x1="-70" y1="-70" x2="-100" y2="-118" />
        <line x1="70" y1="-70" x2="100" y2="-118" />
      </g>
      <circle cx="-100" cy="-122" r="9" fill="#37c6ff" />
      <circle cx="100" cy="-122" r="9" fill="#b23bff" />
      <circle cx="-58" cy="55" r="20" fill="#fff" />
      <circle cx="58" cy="55" r="20" fill="#fff" />
      <circle cx="-58" cy="55" r="9" fill="#0c3d55" />
      <circle cx="58" cy="55" r="9" fill="#0c3d55" />
      <path d="M -335 40 A 335 122 -18 0 0 305 -70" fill="none" stroke="url(#e_rg)" strokeWidth="26" strokeLinecap="round" transform="rotate(-18)" />
      <g transform="translate(300 -120)">
        <circle r="34" fill="url(#e_pl)" stroke="#8a7bff" strokeWidth="2" />
        <ellipse rx="52" ry="14" fill="none" stroke="#b23bff" strokeWidth="6" transform="rotate(-18)" />
      </g>
    </svg>
  );
}
