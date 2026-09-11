import { useEffect } from 'react'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Footprints, Pause, Play } from 'lucide-react'
import type { Iteration } from '../types/bisection'
import { describeDecision } from '../utils/stepNarrative'

interface StepByStepProps {
  iterations: Iteration[]
  index: number
  playing: boolean
  speed: number
  onIndexChange: (index: number) => void
  onPlayingChange: (playing: boolean) => void
  onSpeedChange: (speed: number) => void
}

const SPEEDS = [0.5, 1, 2]
const format = (value: number) => value.toFixed(6)

export function StepByStep({ iterations, index, playing, speed, onIndexChange, onPlayingChange, onSpeedChange }: StepByStepProps) {
  const total = iterations.length
  const current = iterations[index]
  const isLast = index >= total - 1

  useEffect(() => {
    if (!playing) return
    if (isLast) {
      onPlayingChange(false)
      return
    }
    const timer = window.setTimeout(() => onIndexChange(index + 1), 1400 / speed)
    return () => window.clearTimeout(timer)
  }, [playing, index, speed, isLast, onIndexChange, onPlayingChange])

  if (!current) return null

  const decision = describeDecision(current)

  return (
    <section id="step-by-step" className="panel animate-rise-in overflow-hidden" aria-labelledby="steps-title">
      <div className="panel-head justify-between">
        <div className="flex items-center gap-3">
          <span className="panel-icon bg-orange-500 shadow-orange-200">
            <Footprints size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Procedimiento</p>
            <h2 id="steps-title" className="text-base font-semibold text-slate-950">Paso a paso</h2>
          </div>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white">
          Iteración {current.i} de {total}
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="eyebrow">1 · Punto medio</p>
            <p className="mt-2 break-words font-mono text-[13px] leading-6 text-slate-700">
              cᵢ = (aᵢ + bᵢ) / 2
              <br />
              cᵢ = ({format(current.a)} + {format(current.b)}) / 2
            </p>
            <p className="mt-2 break-all font-mono text-lg font-bold text-indigo-700">cᵢ = {format(current.c)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="eyebrow">2 · Valores de la función</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                ['f(aᵢ)', current.fa],
                ['f(cᵢ)', current.fc],
                ['f(bᵢ)', current.fb],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-slate-500">{label as string}</p>
                  <p className={`mt-0.5 break-all font-mono text-[13px] font-bold ${(value as number) < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {format(value as number)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="eyebrow">3 · Error relativo</p>
            {current.error === null ? (
              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                Es la primera iteración: todavía no hay una aproximación anterior con la cual comparar.
              </p>
            ) : (
              <>
                <p className="mt-2 font-mono text-[13px] text-slate-600">Eᵢ = |(cᵢ − cᵢ₋₁) / cᵢ| × 100</p>
                <p className="mt-1 break-all font-mono text-lg font-bold text-slate-900">{format(current.error)} %</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className={`rounded-xl border p-4 ${decision.exact ? 'border-emerald-200 bg-emerald-50' : 'border-indigo-200 bg-indigo-50/60'}`}>
            <p className="eyebrow">4 · Decisión</p>
            <p className="mt-2 font-mono text-[13px] font-bold text-slate-900">{decision.test}</p>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">{decision.reason}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Se conserva</p>
              <p className="mt-1.5 break-all font-mono text-sm font-bold text-emerald-900">
                [{format(decision.keep[0])}, {format(decision.keep[1])}]
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Se descarta</p>
              <p className="mt-1.5 break-all font-mono text-sm font-bold text-slate-400 line-through">
                [{format(decision.discard[0])}, {format(decision.discard[1])}]
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="eyebrow">5 · Razón matemática</p>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">{decision.theorem}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onIndexChange(0)} disabled={index === 0} className="icon-button" aria-label="Primera iteración">
            <ChevronFirst size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onIndexChange(index - 1)} disabled={index === 0} className="icon-button" aria-label="Iteración anterior">
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onPlayingChange(!playing)}
            disabled={isLast && !playing}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-600 px-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {playing ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}
            {playing ? 'Pausar' : 'Reproducir'}
          </button>
          <button type="button" onClick={() => onIndexChange(index + 1)} disabled={isLast} className="icon-button" aria-label="Siguiente iteración">
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onIndexChange(total - 1)} disabled={isLast} className="icon-button" aria-label="Última iteración">
            <ChevronLast size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Velocidad</span>
          {SPEEDS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSpeedChange(option)}
              aria-pressed={speed === option}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition ${
                speed === option ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-200'
              }`}
            >
              {option}×
            </button>
          ))}
        </div>

        <label className="ml-auto flex min-w-[180px] flex-1 items-center gap-3">
          <span className="sr-only">Ir a una iteración</span>
          <input
            type="range"
            min={0}
            max={Math.max(total - 1, 0)}
            value={index}
            onChange={(event) => onIndexChange(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
          />
        </label>
      </div>
    </section>
  )
}
