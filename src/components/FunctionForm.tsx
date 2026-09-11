import { CircleHelp, LineChart, Play, TriangleAlert } from 'lucide-react'
import { Guide } from './Guide'

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

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'

function FieldLabel({ text, guide }: { text: string; guide: { title: string; detail: string; formula?: string } }) {
  return (
    <span className="flex items-center gap-1.5">
      {text}
      <Guide title={guide.title} detail={guide.detail} formula={guide.formula} placement="right" focusable>
        <CircleHelp size={14} className="text-slate-400 transition hover:text-indigo-600" aria-hidden="true" />
      </Guide>
    </span>
  )
}

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
    <div className="space-y-4 p-4 sm:p-5">
      <div id="field-function">
        <label htmlFor="function" className="label">
          <FieldLabel
            text="Función f(x)"
            guide={{
              title: 'Función a analizar',
              detail: 'Escribe la ecuación igualada a cero. Usa x como variable, ^ para potencias y funciones como sin, cos, exp, log o sqrt.',
              formula: 'ej. exp(-x) + sin(x) - x^2',
            }}
          />
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 mt-0.5 -translate-y-1/2 font-serif text-lg italic text-indigo-600">f</span>
          <input
            id="function"
            className={`${inputClass} pl-9 font-mono`}
            value={expression}
            onChange={(event) => onExpressionChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && onGraph()}
            placeholder="exp(-x) + sin(x) - x^2"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <p className="mt-1.5 text-[13px] leading-4 text-slate-500">Usa x como variable y ^ para potencias.</p>
      </div>

      <Guide
        block
        placement="right"
        title="Paso 1: explorar"
        detail="Dibuja la curva en el rango [−10, 10] y busca automáticamente los tramos donde la función cruza el eje X, es decir, donde cambia de signo."
      >
        <button type="button" id="btn-graph" onClick={onGraph} className="button-secondary w-full">
          <LineChart size={18} aria-hidden="true" />
          Graficar y detectar intervalos
        </button>
      </Guide>

      <div className="grid grid-cols-2 gap-3">
        <label className="label" htmlFor="a">
          <FieldLabel
            text="Límite a"
            guide={{
              title: 'Extremo izquierdo',
              detail: 'Inicio del intervalo de búsqueda. Debe cumplirse que f(a) tenga signo opuesto a f(b) para garantizar que exista una raíz encerrada.',
              formula: 'a < b   y   f(a) · f(b) < 0',
            }}
          />
          <input id="a" type="number" step="any" value={a} onChange={(event) => onAChange(event.target.value)} className={inputClass} />
        </label>
        <label className="label" htmlFor="b">
          <FieldLabel
            text="Límite b"
            guide={{
              title: 'Extremo derecho',
              detail: 'Fin del intervalo de búsqueda. En cada iteración el método reduce a la mitad la distancia entre a y b hasta acorralar la raíz.',
              formula: 'amplitud = (b − a) / 2ⁱ',
            }}
          />
          <input id="b" type="number" step="any" value={b} onChange={(event) => onBChange(event.target.value)} className={inputClass} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="label" htmlFor="tolerance" id="field-tolerance">
          <FieldLabel
            text="Tolerancia (%)"
            guide={{
              title: 'Criterio de parada',
              detail: 'El método se detiene cuando el error relativo porcentual entre dos aproximaciones consecutivas cae por debajo de este valor. Más pequeño significa más iteraciones y más precisión.',
              formula: 'Eᵢ = |(cᵢ − cᵢ₋₁) / cᵢ| × 100',
            }}
          />
          <input id="tolerance" type="number" min="0" step="any" value={tolerance} onChange={(event) => onToleranceChange(event.target.value)} className={inputClass} />
        </label>
        <label className="label" htmlFor="iterations">
          <FieldLabel
            text="Máx. iteraciones"
            guide={{
              title: 'Tope de seguridad',
              detail: 'Número máximo de divisiones permitidas. Evita que el cálculo se prolongue si la tolerancia elegida es demasiado exigente.',
              formula: 'entero ≥ 1',
            }}
          />
          <input id="iterations" type="number" min="1" step="1" value={maxIterations} onChange={(event) => onMaxIterationsChange(event.target.value)} className={inputClass} />
        </label>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-5 text-red-700">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Guide
        block
        placement="right"
        title="Paso 2: resolver"
        detail="Aplica el método de bisección sobre el intervalo indicado y genera la tabla completa de iteraciones con el error de cada paso."
        formula="cᵢ = (aᵢ + bᵢ) / 2"
      >
        <button type="button" id="btn-calculate" onClick={onCalculate} className="button-primary w-full">
          <Play size={17} fill="currentColor" aria-hidden="true" />
          Calcular raíz
        </button>
      </Guide>
    </div>
  )
}
