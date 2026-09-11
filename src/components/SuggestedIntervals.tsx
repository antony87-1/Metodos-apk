import { MousePointerClick, ScanSearch } from 'lucide-react'
import type { Interval } from '../types/bisection'

interface SuggestedIntervalsProps {
  intervals: Interval[]
  selected: Interval | null
  hasGraphed: boolean
  onSelect: (interval: Interval) => void
}

export function SuggestedIntervals({ intervals, selected, hasGraphed, onSelect }: SuggestedIntervalsProps) {
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="intervals-title">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
          <ScanSearch size={19} aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">Análisis en [−10, 10]</p>
          <h2 id="intervals-title" className="text-lg font-semibold text-slate-950">Intervalos recomendados</h2>
        </div>
      </div>

      {!hasGraphed ? (
        <p className="rounded-xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
          Grafica la función para localizar cambios de signo automáticamente.
        </p>
      ) : intervals.length === 0 ? (
        <p className="rounded-xl bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
          No se encontraron cambios de signo con el barrido actual. Prueba otro intervalo manual.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {intervals.map((interval) => {
            const isSelected = selected?.a === interval.a && selected?.b === interval.b
            return (
              <button
                type="button"
                key={`${interval.a}-${interval.b}`}
                onClick={() => onSelect(interval)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 font-mono text-sm font-semibold transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <MousePointerClick size={15} aria-hidden="true" />
                [{interval.a}, {interval.b}]
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
