import type { ReactNode } from 'react'

const shapes: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M3.6 10.6 12 3.6l8.4 7" />
      <path d="M6.1 9.4V20h11.8V9.4" />
    </>
  ),
  grid: (
    <>
      <rect x="3.6" y="3.6" width="7" height="7" rx="2" />
      <rect x="13.4" y="3.6" width="7" height="7" rx="2" />
      <rect x="3.6" y="13.4" width="7" height="7" rx="2" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="2" />
    </>
  ),
  check: (
    <>
      <rect x="3.6" y="4.2" width="16.8" height="15.6" rx="2.6" />
      <path d="M8.4 12.1l2.4 2.4 4.8-5.1" />
    </>
  ),
  folder: (
    <path d="M3.6 7.6a2 2 0 0 1 2-2h3.1l1.9 2.2h6.2a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z" />
  ),
  layers: (
    <>
      <path d="M12 3.7 3.9 8 12 12.3 20.1 8z" />
      <path d="M3.9 12.6 12 16.9l8.1-4.3" />
    </>
  ),
  flow: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.4 6H13a3.2 3.2 0 0 1 3.2 3.2v6.4" />
    </>
  ),
  approve: (
    <>
      <rect x="4.6" y="4.6" width="14.8" height="15.4" rx="2.4" />
      <path d="M9.4 4.6V3.4h5.2v1.2" />
      <path d="M8.9 12.4l2.3 2.3 4.2-4.5" />
    </>
  ),
  rules: (
    <>
      <path d="M4.4 8.4h5" />
      <path d="M14.6 8.4h5" />
      <circle cx="12" cy="8.4" r="2.2" />
      <path d="M4.4 15.6h5" />
      <path d="M14.6 15.6h5" />
      <circle cx="12" cy="15.6" r="2.2" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.8C10.4 5.6 8 5 5 5.2v12.4c3-.2 5.4.4 7 1.6 1.6-1.2 4-1.8 7-1.6V5.2c-3-.2-5.4.4-7 1.6z" />
      <path d="M12 6.8v12.4" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.6v2m0 12.8v2M4.7 7.8l1.7 1M17.6 15.2l1.7 1M4.7 16.2l1.7-1M17.6 8.8l1.7-1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="M15.7 15.7 20.8 20.8" />
    </>
  ),
  bell: (
    <>
      <path d="M6.6 10.2a5.4 5.4 0 0 1 10.8 0c0 4.7 1.9 5.8 1.9 5.8H4.7s1.9-1.1 1.9-5.8" />
      <path d="M10.3 19.2a2 2 0 0 0 3.4 0" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.6l1.7 4.7 4.7 1.7-4.7 1.7L12 16.4l-1.7-4.7L5.6 10l4.7-1.7z" />
      <path d="M18.6 16.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
    </>
  ),
  moon: <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.1M12 19.1v2.1M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.5 19.5 6 18M18 6l1.5-1.5" />
    </>
  ),
  right: <path d="M9.4 6.4 15 12l-5.6 5.6" />,
  arrow: (
    <>
      <path d="M4.6 12h14" />
      <path d="M13.4 6.4 19 12l-5.6 5.6" />
    </>
  ),
  upRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M9.4 7H17v7.6" />
    </>
  ),
  plus: <path d="M12 5.4v13.2M5.4 12h13.2" />,
  clip: (
    <path d="M17.6 8.6 9.9 16.3a2.6 2.6 0 0 1-3.7-3.7l8.4-8.4a4 4 0 0 1 5.6 5.6l-8.6 8.6a5.4 5.4 0 0 1-7.6-7.6l7.8-7.8" />
  ),
  mic: (
    <>
      <rect x="9.2" y="3.2" width="5.6" height="10.8" rx="2.8" />
      <path d="M5.6 11.6a6.4 6.4 0 0 0 12.8 0" />
      <path d="M12 18v3" />
    </>
  ),
  send: (
    <>
      <path d="M5 12h13.4" />
      <path d="M12.6 5.6 19 12l-6.4 6.4" />
    </>
  ),
  x: <path d="M6.6 6.6 17.4 17.4M17.4 6.6 6.6 17.4" />,
  panel: (
    <>
      <rect x="3.6" y="4.6" width="16.8" height="14.8" rx="2.6" />
      <path d="M9.6 4.6v14.8" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18l4.2-5.6" />
      <circle cx="12" cy="18" r="1.4" />
    </>
  ),
  activity: <path d="M3.5 12.5h4l2.4-6 3.6 12 2.4-6h4.6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6V12l3 1.8" />
    </>
  ),
  filter: <path d="M4.4 6.4h15.2M7.2 12h9.6M10 17.6h4" />,
  refresh: (
    <>
      <path d="M19.4 12a7.4 7.4 0 1 1-2.2-5.2" />
      <path d="M19.8 4.6v4.2h-4.2" />
    </>
  ),
  download: (
    <>
      <path d="M12 4.6v10" />
      <path d="M8 11.2 12 15l4-3.8" />
      <path d="M5 18.4h14" />
    </>
  ),
  archive: (
    <>
      <rect x="3.6" y="4.6" width="16.8" height="4.4" rx="1.6" />
      <path d="M5.4 9v9.2a1.6 1.6 0 0 0 1.6 1.6h10a1.6 1.6 0 0 0 1.6-1.6V9" />
      <path d="M10 13h4" />
    </>
  ),
  message: <path d="M4.6 6.4a2 2 0 0 1 2-2h10.8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.4v-3.4H6.6a2 2 0 0 1-2-2z" />,
  file: (
    <>
      <path d="M6.4 4.4h7l4.2 4.2v11H6.4z" />
      <path d="M13.2 4.4v4.4h4.4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.6 21 19.4H3z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="17" r=".7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.6" r="3.6" />
      <path d="M5 19.4c.9-3.2 3.6-4.8 7-4.8s6.1 1.6 7 4.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.6 5 6.2v5.4c0 4.4 3 7.4 7 8.8 4-1.4 7-4.4 7-8.8V6.2z" />
      <path d="M9.2 12.2l2 2 3.6-3.8" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6.6" rx="7" ry="2.8" />
      <path d="M5 6.6v10.8c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6.6" />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  list: (
    <>
      <path d="M8.4 6.6h11.2M8.4 12h11.2M8.4 17.4h11.2" />
      <circle cx="4.9" cy="6.6" r=".9" />
      <circle cx="4.9" cy="12" r=".9" />
      <circle cx="4.9" cy="17.4" r=".9" />
    </>
  ),
  trendUp: (
    <>
      <path d="M4 16.4 9.6 10.8l3.4 3.4L20 7.2" />
      <path d="M14.6 7.2H20v5.4" />
    </>
  ),
  zap: <path d="M13.4 3.6 5.6 13.4h5l-.6 7 8-10h-5z" />,
  key: (
    <>
      <circle cx="8.4" cy="15.6" r="3.4" />
      <path d="M10.8 13.2 19 5l1.6 1.6-1.8 1.8 1.4 1.4-2 2-1.4-1.4-1.6 1.6" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3.6v4M15 3.6v4" />
      <path d="M6.6 7.6h10.8v2.6a5.4 5.4 0 0 1-10.8 0z" />
      <path d="M12 15.6v4.8" />
    </>
  ),
  history: (
    <>
      <path d="M4.6 12a7.4 7.4 0 1 0 2.2-5.2" />
      <path d="M4.2 4.6v4.2h4.2" />
      <path d="M12 8.4V12l2.8 1.8" />
    </>
  ),
  building: (
    <>
      <path d="M5.6 20V5.2a1.6 1.6 0 0 1 1.6-1.6h5.6a1.6 1.6 0 0 1 1.6 1.6V20" />
      <path d="M14.4 10.4h4.4v9.6" />
      <path d="M8.4 7.6h3M8.4 11.6h3M8.4 15.6h3" />
      <path d="M6 20h14" />
    </>
  ),
  more: (
    <>
      <circle cx="5.6" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18.4" cy="12" r="1.2" />
    </>
  ),
  link: (
    <>
      <path d="M10.4 13.6a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.2 1.2" />
      <path d="M13.6 10.4a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.2-1.2" />
    </>
  ),
  lock: (
    <>
      <rect x="5.4" y="10.6" width="13.2" height="9" rx="2.2" />
      <path d="M8.4 10.6V8a3.6 3.6 0 0 1 7.2 0v2.6" />
    </>
  ),
  branch: (
    <>
      <circle cx="6.6" cy="5.6" r="2" />
      <circle cx="6.6" cy="18.4" r="2" />
      <circle cx="17.4" cy="9.4" r="2" />
      <path d="M6.6 7.6v8.8" />
      <path d="M8.6 5.8h4.4a2.4 2.4 0 0 1 2.4 2.4v.2" />
    </>
  ),
}

export type IconName = keyof typeof shapes

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: '0 0 auto' }}
    >
      {shapes[name] ?? shapes.grid}
    </svg>
  )
}
