"use client"
import { cn } from "@/lib/utils"

type StepperProps = { current: number; total: number }

export function Stepper({ current, total }: StepperProps) {
  const pct = Math.max(0, Math.min(100, Math.round((current / total) * 100)))
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>
          Step {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded">
        <div className={cn("h-2 rounded bg-brand-gold")} style={{ width: `${pct}%` }} aria-hidden="true" />
      </div>
    </div>
  )
}
