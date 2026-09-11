import { Table2 } from 'lucide-react'
import type { Iteration } from '../types/bisection'
import { Guide } from './Guide'

interface IterationTableProps {
  iterations: Iteration[]
}

const format = (value: number) => value.toFixed(6)

interface Column {
  label: string
  key: keyof Iteration
  title: string
  detail: string
  formula?: string
}

const COLUMNS: Column[] = [
  { label: 'i', key: 'i', title: 'Número de iteración', detail: 'Cuántas veces se ha partido el intervalo por la mitad. Cada fila reduce el margen de error a la mitad.' },
  { label: 'aᵢ', key: 'a', title: 'Extremo izquierdo', detail: 'Límite inferior vigente en esta iteración. Se actualiza solo cuando la raíz queda en la mitad derecha.' },
  { label: 'bᵢ', key: 'b', title: 'Extremo derecho', detail: 'Límite superior vigente en esta iteración. Se actualiza cuando la raíz queda en la mitad izquierda.' },
  { label: 'cᵢ', key: 'c', title: 'Punto medio (aproximación)', detail: 'La estimación de la raíz en este paso: el centro exacto del intervalo actual.', formula: 'cᵢ = (aᵢ + bᵢ) / 2' },
  { label: 'f(aᵢ)', key: 'fa', title: 'Valor en el extremo izquierdo', detail: 'Sirve para comparar signos: si f(aᵢ) y f(cᵢ) tienen signos opuestos, la raíz está en la mitad izquierda.' },
  { label: 'f(cᵢ)', key: 'fc', title: 'Valor en el punto medio', detail: 'Mientras más cerca de cero, mejor es la aproximación. Si llega a valer exactamente 0, se encontró la raíz exacta.' },
  { label: 'f(bᵢ)', key: 'fb', title: 'Valor en el extremo derecho', detail: 'Junto con f(aᵢ) garantiza que el intervalo sigue encerrando una raíz.' },
  { label: 'Eᵢ (%)', key: 'error', title: 'Error relativo porcentual', detail: 'Diferencia entre la aproximación actual y la anterior. El método se detiene cuando cae bajo la tolerancia.', formula: 'Eᵢ = |(cᵢ − cᵢ₋₁) / cᵢ| × 100' },
]

export function IterationTable({ iterations }: IterationTableProps) {
  const lastIndex = iterations.length - 1

  return (
    <section id="iteration-table" className="panel animate-rise-in overflow-hidden" aria-labelledby="table-title">
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-transparent px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Table2 size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Paso a paso</p>
            <h2 id="table-title" className="text-lg font-semibold text-slate-950">Tabla de iteraciones</h2>
          </div>
        </div>
        <Guide
          title="Recorrido completo"
          detail="Cada fila documenta una división del intervalo. Apunta a cualquier encabezado para saber qué representa esa columna."
          placement="left"
          focusable
        >
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{iterations.length} filas</span>
        </Guide>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-slate-900 text-white shadow-sm">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.label} className="px-4 py-3.5 text-xs font-semibold tracking-wide">
                  <Guide title={column.title} detail={column.detail} formula={column.formula} placement="bottom" focusable>
                    <span className="border-b border-dashed border-white/30 pb-0.5">{column.label}</span>
                  </Guide>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {iterations.map((iteration, index) => (
              <tr
                key={iteration.i}
                className={`transition ${index === lastIndex ? 'bg-emerald-50/80 hover:bg-emerald-100/70' : 'bg-white hover:bg-indigo-50/60'}`}
              >
                {COLUMNS.map(({ key }) => (
                  <td
                    key={key}
                    className={`whitespace-nowrap px-4 py-3 font-mono text-[13px] ${
                      key === 'i' ? 'font-bold text-indigo-600' : key === 'c' ? 'font-semibold text-slate-950' : 'text-slate-600'
                    }`}
                  >
                    {key === 'i' ? (
                      <span className="inline-flex items-center gap-2">
                        {iteration.i}
                        {index === lastIndex && (
                          <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">final</span>
                        )}
                      </span>
                    ) : key === 'error' ? (
                      iteration.error === null ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        format(iteration.error)
                      )
                    ) : (
                      format(iteration[key] as number)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
