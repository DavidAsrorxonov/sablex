type IconProps = {
  className?: string;
};

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 2,
};

export function MenuIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function GlobeIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.3 2.5 3.4 5.5 3.4 9S14.3 18.5 12 21" />
      <path d="M12 3c-2.3 2.5-3.4 5.5-3.4 9s1.1 6.5 3.4 9" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function InfoIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function BookmarkIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
    </svg>
  );
}

export function ShareIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </svg>
  );
}

export function MoreIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  );
}

export function ExternalMark({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...iconProps}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
