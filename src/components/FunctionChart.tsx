import { useState } from 'react'
import { Activity, Crosshair } from 'lucide-react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
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
import { Guide } from './Guide'

interface FunctionChartProps {
  data: ChartPoint[]
  interval: Interval | null
  root: number | null
  expression: string
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartPoint }> }) {
  if (!active || !payload?.[0]) return null
  const point = payload[0].payload
  if (point.y === null) return null
  return (
    <div className="pointer-events-none rounded-xl border border-white/10 bg-slate-900/95 px-3.5 py-2.5 text-xs shadow-guide backdrop-blur">
      <p className="font-mono font-semibold text-white">x = {point.x.toFixed(3)}</p>
      <p className="mt-1 font-mono text-cyan-300">f(x) = {point.y.toFixed(5)}</p>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {point.y > 0 ? 'La curva está sobre el eje' : 'La curva está bajo el eje'}
      </p>
    </div>
  )
}

export function FunctionChart({ data, interval, root, expression }: FunctionChartProps) {
  const [hover, setHover] = useState<ChartPoint | null>(null)

  const handleMove = (state: { activePayload?: Array<{ payload: ChartPoint }> } | null) => {
    const point = state?.activePayload?.[0]?.payload
    setHover(point && point.y !== null ? point : null)
  }

  return (
    <section className="panel min-w-0 overflow-hidden" aria-labelledby="chart-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-transparent px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Activity size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Vista cartesiana</p>
            <h2 id="chart-title" className="text-lg font-semibold text-slate-950">Gráfica de la función</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hover && (
            <span className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 font-mono text-xs font-semibold text-indigo-700">
              <Crosshair size={13} aria-hidden="true" />
              x {hover.x.toFixed(2)} · f(x) {hover.y?.toFixed(4)}
            </span>
          )}
          <span className="max-w-full truncate rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-600">f(x) = {expression}</span>
        </div>
      </div>

      <div className="h-[340px] p-3 sm:h-[440px] sm:p-5">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 16, right: 18, bottom: 8, left: -8 }}
              onMouseMove={handleMove}
              onMouseLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="x" type="number" domain={[-10, 10]} tickCount={11} stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tickLine={false} width={50} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: '#6366f1', strokeWidth: 1.2, strokeDasharray: '4 4' }}
              />

              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.3} />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />

              {interval && (
                <>
                  <ReferenceArea x1={interval.a} x2={interval.b} fill="#f97316" fillOpacity={0.12} stroke="#f97316" strokeOpacity={0.45} />
                  <ReferenceLine x={interval.a} stroke="#f97316" strokeDasharray="5 4" strokeOpacity={0.75}>
                    <Label value="a" position="top" fill="#ea580c" fontSize={12} fontWeight={700} />
                  </ReferenceLine>
                  <ReferenceLine x={interval.b} stroke="#f97316" strokeDasharray="5 4" strokeOpacity={0.75}>
                    <Label value="b" position="top" fill="#ea580c" fontSize={12} fontWeight={700} />
                  </ReferenceLine>
                </>
              )}

              <Area type="monotone" dataKey="y" stroke="none" fill="url(#curveFill)" connectNulls={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={2.6} dot={false} connectNulls={false} isAnimationActive animationDuration={650} />

              {hover?.y != null && (
                <ReferenceLine y={hover.y} stroke="#6366f1" strokeWidth={1.1} strokeDasharray="4 4" strokeOpacity={0.7} />
              )}
              {hover?.y != null && (
                <ReferenceDot x={hover.x} y={hover.y} r={4.5} fill="#4f46e5" stroke="#fff" strokeWidth={2} isFront />
              )}

              {root !== null && (
                <ReferenceDot x={root} y={0} r={6} fill="#f97316" stroke="#fff" strokeWidth={3} isFront>
                  <Label value="raíz" position="bottom" fill="#ea580c" fontSize={11} fontWeight={700} offset={10} />
                </ReferenceDot>
              )}
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
        <Guide
          title="Curva de f(x)"
          detail="Trazo de la función evaluada punto a punto. Donde cruza el eje horizontal hay una raíz."
          className="items-center gap-2"
          focusable
        >
          <i className="h-0.5 w-5 rounded bg-indigo-600" />Función
        </Guide>
        <Guide
          title="Intervalo activo [a, b]"
          detail="Zona naranja donde el método está buscando. Con cada iteración este bloque se reduce a la mitad."
          className="items-center gap-2"
          focusable
        >
          <i className="h-3 w-5 rounded bg-orange-200" />Intervalo
        </Guide>
        <Guide
          title="Raíz aproximada"
          detail="Punto final que devuelve el método: el valor de x donde f(x) ≈ 0 dentro de la tolerancia pedida."
          className="items-center gap-2"
          focusable
        >
          <i className="h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-orange-100" />Raíz
        </Guide>
        <span className="ml-auto hidden items-center gap-1.5 text-slate-400 sm:inline-flex">
          <Crosshair size={13} aria-hidden="true" /> Mueve el puntero sobre la curva para leer coordenadas
        </span>
      </div>
    </section>
  )
}
