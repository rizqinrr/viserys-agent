"use client"

import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { SonarGrid } from "@/components/ui/sonar-grid"

const settings = {
  ringWidth: 90,
  speed: 260,
  amplitude: 2.2,
  pingEvery: 2.4,
  interactive: true,
  spacing: 26,
  baseOpacity: 0.28,
  useThemeColor: true,
  color: "#e5b85b",
  eyebrow: "v0.1.0 Public Release",
  headline: "Engineering Workflow Pack untuk AI Coding Agents.",
  subline: "Ubah ide fitur menjadi spesifikasi PRD, pecahan task vertikal, dan sistem desain terukur sebelum agent mulai menulis kode.",
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props }
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <SonarGrid
      id="sonar-grid-demo"
      ringWidth={s.ringWidth}
      speed={s.speed}
      amplitude={s.amplitude}
      pingEvery={s.pingEvery}
      interactive={s.interactive}
      spacing={s.spacing}
      baseOpacity={s.baseOpacity}
      color={s.useThemeColor ? undefined : s.color}
      pingArea={[0.22, 0.18, 0.78, 0.82]}
      className="bg-background flex min-h-[max(560px,100svh)] w-full flex-col"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_34%_30%_at_50%_50%,var(--color-background)_0%,transparent_100%)]"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-8 py-24 text-center">
        <div className="flex max-w-2xl flex-col items-center">
          <motion.h1
            {...enter(0)}
            className="text-foreground text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
          >
            {s.headline}
          </motion.h1>
          <motion.p {...enter(0.08)} className="text-muted-foreground mt-6 max-w-xl text-base text-pretty sm:text-lg">
            {s.subline}
          </motion.p>
          <motion.div {...enter(0.16)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#workbench"
              id="cta-primary"
              data-slot="cta-primary"
              className="group bg-primary text-primary-foreground focus-visible:ring-ring/50 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-medium shadow-sm transition-[transform,box-shadow] duration-200 outline-none hover:shadow-md focus-visible:ring-[3px] active:scale-[0.98]"
            >
              Lihat Simulasi Alur
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="https://skills.sh/rizqinrr/viserys-agent"
              target="_blank"
              rel="noopener noreferrer"
              data-slot="cta-secondary"
              className="bg-background/70 text-foreground border-border hover:bg-accent focus-visible:ring-ring/50 inline-flex h-11 cursor-pointer items-center rounded-full border px-6 text-sm font-medium backdrop-blur transition-[background-color,transform] duration-200 outline-none focus-visible:ring-[3px] active:scale-[0.98]"
            >
              skills.sh Registry
            </a>
          </motion.div>
        </div>
      </div>
    </SonarGrid>
  )
}

