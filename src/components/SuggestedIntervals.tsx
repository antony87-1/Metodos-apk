import { MousePointerClick } from 'lucide-react'
import type { Interval } from '../types/bisection'
import { Guide } from './Guide'

interface SuggestedIntervalsProps {
  intervals: Interval[]
  selected: Interval | null
  hasGraphed: boolean
  onSelect: (interval: Interval) => void
}

export function SuggestedIntervals({ intervals, selected, hasGraphed, onSelect }: SuggestedIntervalsProps) {
  return (
    <div className="p-4 sm:p-5">
      {!hasGraphed ? (
        <p className="rounded-xl bg-slate-50 px-3.5 py-3 text-[13px] leading-5 text-slate-500">
          Grafica la función para localizar cambios de signo automáticamente.
        </p>
      ) : intervals.length === 0 ? (
        <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-[13px] leading-5 text-amber-800">
          No se encontraron cambios de signo con el barrido actual. Prueba otro intervalo manual.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {intervals.map((interval) => {
            const isSelected = selected?.a === interval.a && selected?.b === interval.b
            return (
              <Guide
                key={`${interval.a}-${interval.b}`}
                title={`Intervalo [${interval.a}, ${interval.b}]`}
                detail="Aquí la función cambia de signo, así que el teorema de Bolzano garantiza al menos una raíz dentro. Haz clic para cargarlo en el formulario."
                formula="f(a) · f(b) < 0"
                placement="top"
              >
                <button
                  type="button"
                  onClick={() => onSelect(interval)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md'
                  }`}
                >
                  <MousePointerClick size={14} aria-hidden="true" />
                  [{interval.a}, {interval.b}]
                </button>
              </Guide>
            )
          })}
        </div>
      )}
    </div>
  )
}
