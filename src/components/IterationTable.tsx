import { Table2 } from 'lucide-react'
import type { Iteration } from '../types/bisection'

interface IterationTableProps {
  iterations: Iteration[]
}

const format = (value: number) => value.toFixed(6)

export function IterationTable({ iterations }: IterationTableProps) {
  const columns: Array<[string, keyof Iteration]> = [
    ['i', 'i'], ['aᵢ', 'a'], ['bᵢ', 'b'], ['cᵢ', 'c'], ['f(aᵢ)', 'fa'], ['f(cᵢ)', 'fc'], ['f(bᵢ)', 'fb'], ['Eᵢ (%)', 'error'],
  ]

  return (
    <section className="panel overflow-hidden" aria-labelledby="table-title">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Table2 size={19} /></span>
          <div>
            <p className="eyebrow">Paso a paso</p>
            <h2 id="table-title" className="text-lg font-semibold text-slate-950">Tabla de iteraciones</h2>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{iterations.length} filas</span>
      </div>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-slate-900 text-white shadow-sm">
            <tr>
              {columns.map(([label]) => <th key={label} className="px-4 py-3.5 text-xs font-semibold tracking-wide">{label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {iterations.map((iteration) => (
              <tr key={iteration.i} className="bg-white transition hover:bg-indigo-50/60">
                {columns.map(([, key]) => (
                  <td key={key} className={`whitespace-nowrap px-4 py-3 font-mono text-[13px] ${key === 'i' ? 'font-bold text-indigo-600' : key === 'c' ? 'font-semibold text-slate-950' : 'text-slate-600'}`}>
                    {key === 'i' ? iteration.i : key === 'error' ? (iteration.error === null ? '—' : format(iteration.error)) : format(iteration[key] as number)}
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
