import { CheckCircle2, TriangleAlert } from 'lucide-react'
import type { BisectionResult } from '../types/bisection'
import { Guide } from './Guide'

interface ResultsCardProps {
  result: BisectionResult
}

const format = (value: number) => (Number.isFinite(value) ? value.toFixed(6) : '—')

export function ResultsCard({ result }: ResultsCardProps) {
  const metrics: Array<{ label: string; value: string; title: string; detail: string; formula?: string }> = [
    {
      label: 'f(raíz)',
      value: format(result.fRoot),
      title: 'Residuo de la función',
      detail: 'Valor de la función evaluada en la raíz encontrada. Mientras más cerca de cero, mejor es la aproximación.',
      formula: 'f(c) ≈ 0',
    },
    {
      label: 'Error final',
      value: `${format(result.finalError)} %`,
      title: 'Error relativo alcanzado',
      detail: 'Diferencia porcentual entre las dos últimas aproximaciones. Es el valor que se compara contra la tolerancia.',
      formula: 'E = |(cₙ − cₙ₋₁) / cₙ| × 100',
    },
    {
      label: 'Iteraciones',
      value: String(result.iterations.length),
      title: 'Divisiones realizadas',
      detail: 'Cuántas veces se partió el intervalo hasta cumplir la tolerancia o llegar al tope configurado.',
    },
    {
      label: 'Intervalo final',
      value: `[${format(result.finalInterval.a)}, ${format(result.finalInterval.b)}]`,
      title: 'Intervalo de encierro',
      detail: 'Último tramo donde quedó acorralada la raíz. Su amplitud indica la incertidumbre que queda.',
      formula: 'amplitud = (b₀ − a₀) / 2ⁿ',
    },
    {
      label: 'Tolerancia',
      value: `${result.tolerance} %`,
      title: 'Tolerancia exigida',
      detail: 'Criterio de parada que configuraste. El método se detiene al bajar de este umbral.',
    },
  ]

  return (
    <section
      id="results-card"
      className={`animate-rise-in overflow-hidden rounded-2xl border shadow-panel ${
        result.converged
          ? 'border-emerald-300/60 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900'
          : 'border-amber-300/60 bg-gradient-to-br from-amber-950 via-slate-950 to-amber-900'
      }`}
      aria-labelledby="result-title"
    >
      <div className="grid gap-6 p-6 text-white lg:grid-cols-[1.1fr_2fr] lg:items-center lg:p-8">
        <div>
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
              result.converged ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
            }`}
          >
            {result.converged ? <CheckCircle2 size={18} aria-hidden="true" /> : <TriangleAlert size={18} aria-hidden="true" />}
            {result.converged ? 'Convergencia alcanzada' : 'Límite de iteraciones alcanzado'}
          </div>
          <p id="result-title" className="text-sm text-white/60">Raíz aproximada</p>
          <Guide
            block
            focusable
            placement="bottom"
            title="Raíz aproximada"
            detail="Valor de x donde la función vale prácticamente cero. Es el punto medio de la última iteración calculada."
            formula="x ≈ cₙ"
          >
            <p className="mt-1 break-all font-mono text-3xl font-bold tracking-tight sm:text-4xl">{format(result.root)}</p>
          </Guide>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((metric) => (
            <Guide
              key={metric.label}
              block
              focusable
              placement="bottom"
              title={metric.title}
              detail={metric.detail}
              formula={metric.formula}
            >
              <div className="metric-tile h-full">
                <p className="text-xs text-white/55">{metric.label}</p>
                <p className="mt-1 truncate font-mono text-sm font-semibold text-white" title={metric.value}>{metric.value}</p>
              </div>
            </Guide>
          ))}
        </div>
      </div>
    </section>
  )
}
