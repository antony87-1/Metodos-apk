import { Play } from 'lucide-react'
import { SAMPLE_FUNCTIONS, type SampleFunction } from '../data/sampleFunctions'

interface SampleFunctionsProps {
  activeId: string | null
  onSelect: (sample: SampleFunction) => void
}

export function SampleFunctions({ activeId, onSelect }: SampleFunctionsProps) {
  return (
    <>
      <div className="flex snap-x gap-3 overflow-x-auto p-4 no-scrollbar lg:min-h-0 lg:flex-1 lg:snap-none lg:flex-col lg:overflow-y-auto lg:scroll-soft">
        {SAMPLE_FUNCTIONS.map((sample) => {
          const isActive = activeId === sample.id
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample)}
              aria-pressed={isActive}
              className={`group w-[250px] shrink-0 snap-start rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:w-full lg:shrink ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-100'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-900">{sample.name}</p>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}
                  aria-hidden="true"
                >
                  <Play size={12} fill="currentColor" />
                </span>
              </div>

              <p className="mt-2 break-words rounded-lg bg-slate-900 px-2.5 py-1.5 font-mono text-[12px] text-cyan-300">
                f(x) = {sample.expression}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md bg-orange-100 px-2 py-0.5 font-mono text-[11px] font-bold text-orange-700">
                  [{sample.a}, {sample.b}]
                </span>
                <span className="text-[11px] font-medium text-slate-400">intervalo sugerido</span>
              </div>

              <p className="mt-2 text-[12px] leading-4 text-slate-500">{sample.description}</p>
            </button>
          )
        })}
      </div>

      <p className="hidden border-t border-slate-100 px-4 py-2.5 text-[12px] leading-4 text-slate-400 lg:block">
        Al elegir un ejemplo se carga la función, se coloca el intervalo y se grafica automáticamente.
      </p>
    </>
  )
}
