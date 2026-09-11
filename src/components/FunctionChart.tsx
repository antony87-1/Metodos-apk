import { Activity } from 'lucide-react'
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartPoint, Interval } from '../types/bisection'

interface FunctionChartProps {
  data: ChartPoint[]
  interval: Interval | null
  root: number | null
  expression: string
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartPoint }> }) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="font-mono font-semibold text-slate-900">x = {point.x.toFixed(3)}</p>
      <p className="mt-1 font-mono text-indigo-600">f(x) = {point.y?.toFixed(5)}</p>
    </div>
  )
}

export function FunctionChart({ data, interval, root, expression }: FunctionChartProps) {
  return (
    <section className="panel min-w-0 overflow-hidden" aria-labelledby="chart-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Activity size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Vista cartesiana</p>
            <h2 id="chart-title" className="text-lg font-semibold text-slate-950">Gráfica de la función</h2>
          </div>
        </div>
        <span className="max-w-full truncate rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-600">f(x) = {expression}</span>
      </div>

      <div className="h-[340px] p-3 sm:h-[430px] sm:p-5">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 15, right: 15, bottom: 8, left: -8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="x" type="number" domain={[-10, 10]} tickCount={11} stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tickLine={false} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.3} />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
              {interval && <ReferenceArea x1={interval.a} x2={interval.b} fill="#f97316" fillOpacity={0.12} stroke="#f97316" strokeOpacity={0.5} />}
              <Line type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={2.5} dot={false} connectNulls={false} isAnimationActive animationDuration={650} />
              {root !== null && <ReferenceDot x={root} y={0} r={6} fill="#f97316" stroke="#fff" strokeWidth={3} />}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center">
            <div className="max-w-xs px-6">
              <Activity className="mx-auto mb-3 text-slate-300" size={36} aria-hidden="true" />
              <p className="font-medium text-slate-600">La gráfica aparecerá aquí</p>
              <p className="mt-1 text-sm leading-5 text-slate-400">Ingresa una función válida y presiona “Graficar”.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 px-5 py-3 text-xs font-medium text-slate-500 sm:px-6">
        <span className="inline-flex items-center gap-2"><i className="h-0.5 w-5 rounded bg-indigo-600" />Función</span>
        <span className="inline-flex items-center gap-2"><i className="h-3 w-5 rounded bg-orange-200" />Intervalo</span>
        <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-orange-100" />Raíz</span>
      </div>
    </section>
  )
}
