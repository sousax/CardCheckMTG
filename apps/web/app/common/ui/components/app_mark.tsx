import { cn } from '@workspace/ui/lib/utils'

// "Selo CL": Pirata One monogram on a red block with a hard offset shadow.
// The letters are outlined paths (not text) so the mark renders the same
// before the web font loads and matches the favicon exactly. The edge and the
// shadow use currentColor: ink on the red band and in light, cream in dark.
const CL =
  'M22.48 18.43Q22.1 18.43 21.79 18.81V34.5Q21.79 36.1 21.98 37.06Q22.17 38.03 22.82 38.98Q24.07 40.81 28.56 40.81V41.91Q28.37 41.91 25.74 42.95Q23.12 44 22.55 44Q20.65 44 18.94 41.81Q17.23 39.63 17.23 37.2V18.24Q17.23 17.97 21.58 16.36Q25.93 14.74 26.58 14.74Q26.81 14.74 27.11 15.84Q27.42 16.94 27.81 18.5Q28.21 20.06 28.65 20.8Q29.09 21.54 30.3 21.54V22.3Q29.47 22.68 27.47 23.65Q25.48 24.62 25.33 24.62Q24.76 24.62 23.88 21.52Q23.01 18.43 22.48 18.43ZM32.58 38.26V21.77Q32.58 20.36 32.28 19.76Q31.98 19.15 31.03 19.15V17.97L38.82 14.7L39.42 15.92Q38.59 15.92 37.83 16.91Q37.14 17.86 37.14 19.79V35.34Q37.14 38.38 37.68 38.98Q38.59 40.12 39.46 40.35Q41.48 40.81 43.91 40.81V41.87Q38.85 44 38.15 44Q37.45 44 36.23 43.37Q35.02 42.75 33.8 41.34Q32.58 39.93 32.58 38.26Z'

export function AppMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn('shrink-0', className)}>
      <rect
        x="3"
        y="3"
        width="54"
        height="54"
        fill="var(--red)"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M57 9h4v52H9v-4h48z" fill="currentColor" />
      <path d={CL} fill="var(--amber)" />
    </svg>
  )
}
