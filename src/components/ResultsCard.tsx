import { CheckCircle2, TriangleAlert } from 'lucide-react'
import type { BisectionResult } from '../types/bisection'

interface ResultsCardProps {
  result: BisectionResult
}

const format = (value: number) => Number.isFinite(value) ? value.toFixed(6) : '—'

export function ResultsCard({ result }: ResultsCardProps) {
  const metrics = [
    ['f(raíz)', format(result.fRoot)],
    ['Error final', `${format(result.finalError)} %`],
    ['Iteraciones', String(result.iterations.length)],
    ['Intervalo final', `[${format(result.finalInterval.a)}, ${format(result.finalInterval.b)}]`],
    ['Tolerancia', `${result.tolerance} %`],
  ]

  return (
    <section className={`overflow-hidden rounded-2xl border shadow-panel ${result.converged ? 'border-emerald-200 bg-emerald-950' : 'border-amber-200 bg-amber-950'}`} aria-labelledby="result-title">
      <div className="grid gap-6 p-6 text-white lg:grid-cols-[1.1fr_2fr] lg:items-center lg:p-8">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            {result.converged ? <CheckCircle2 size={18} /> : <TriangleAlert size={18} />}
            {result.converged ? 'Convergencia alcanzada' : 'Límite de iteraciones alcanzado'}
          </div>
          <p id="result-title" className="text-sm text-white/60">Raíz aproximada</p>
          <p className="mt-1 break-all font-mono text-3xl font-bold tracking-tight sm:text-4xl">{format(result.root)}</p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-white/[0.06] px-3 py-4 backdrop-blur">
              <dt className="text-xs text-white/55">{label}</dt>
              <dd className="mt-1 truncate font-mono text-sm font-semibold text-white" title={value}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
