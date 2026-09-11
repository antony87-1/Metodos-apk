import { Calculator, LineChart, Play } from 'lucide-react'

interface FunctionFormProps {
  expression: string
  a: string
  b: string
  tolerance: string
  maxIterations: string
  error: string | null
  onExpressionChange: (value: string) => void
  onAChange: (value: string) => void
  onBChange: (value: string) => void
  onToleranceChange: (value: string) => void
  onMaxIterationsChange: (value: string) => void
  onGraph: () => void
  onCalculate: () => void
}

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

export function FunctionForm({
  expression,
  a,
  b,
  tolerance,
  maxIterations,
  error,
  onExpressionChange,
  onAChange,
  onBChange,
  onToleranceChange,
  onMaxIterationsChange,
  onGraph,
  onCalculate,
}: FunctionFormProps) {
  return (
    <section className="panel overflow-hidden" aria-labelledby="configuration-title">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Calculator size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Configuración</p>
            <h2 id="configuration-title" className="text-lg font-semibold text-slate-950">Define el problema</h2>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="function" className="label">Función f(x)</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 mt-1 -translate-y-1/2 font-serif text-lg italic text-indigo-600">f</span>
            <input
              id="function"
              className={`${inputClass} pl-9 font-mono`}
              value={expression}
              onChange={(event) => onExpressionChange(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && onGraph()}
              placeholder="exp(-x) + sin(x) - x^2"
              spellCheck={false}
            />
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-500">Usa x como variable y ^ para potencias.</p>
        </div>

        <button type="button" onClick={onGraph} className="button-secondary w-full">
          <LineChart size={18} aria-hidden="true" />
          Graficar y detectar intervalos
        </button>

        <div className="grid grid-cols-2 gap-3">
          <label className="label" htmlFor="a">
            Límite a
            <input id="a" type="number" step="any" value={a} onChange={(event) => onAChange(event.target.value)} className={inputClass} />
          </label>
          <label className="label" htmlFor="b">
            Límite b
            <input id="b" type="number" step="any" value={b} onChange={(event) => onBChange(event.target.value)} className={inputClass} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="label" htmlFor="tolerance">
            Tolerancia (%)
            <input id="tolerance" type="number" min="0" step="any" value={tolerance} onChange={(event) => onToleranceChange(event.target.value)} className={inputClass} />
          </label>
          <label className="label" htmlFor="iterations">
            Máx. iteraciones
            <input id="iterations" type="number" min="1" step="1" value={maxIterations} onChange={(event) => onMaxIterationsChange(event.target.value)} className={inputClass} />
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
            {error}
          </div>
        )}

        <button type="button" onClick={onCalculate} className="button-primary w-full">
          <Play size={17} fill="currentColor" aria-hidden="true" />
          Calcular raíz
        </button>
      </div>
    </section>
  )
}
