import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react'

interface HowToGuideProps {
  open: boolean
  onClose: () => void
}

interface Step {
  title: string
  highlight: string | null
  body: ReactNode
}

const CODE = 'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-indigo-700'

const STEPS: Step[] = [
  {
    title: 'Elegir o escribir una función',
    highlight: 'field-function',
    body: (
      <>
        <p>Escribe la ecuación igualada a cero usando <code className={CODE}>x</code> como variable, o carga una de las funciones de prueba del panel derecho.</p>
        <ul className="mt-3 space-y-1.5">
          <li><code className={CODE}>sin(x)</code>, <code className={CODE}>cos(x)</code> — funciones trigonométricas en radianes.</li>
          <li><code className={CODE}>exp(x)</code> — exponencial eˣ.</li>
          <li><code className={CODE}>sqrt(x)</code> — raíz cuadrada.</li>
          <li><code className={CODE}>x^2</code> — potencias con el símbolo <code className={CODE}>^</code>.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Graficar',
    highlight: 'btn-graph',
    body: (
      <>
        <p>Al pulsar <strong>Graficar</strong> la función se evalúa en todo el rango <code className={CODE}>[−10, 10]</code> y se dibuja la curva.</p>
        <p className="mt-3">La curva muestra el valor de f(x) en cada punto. Donde la curva <strong>cruza el eje horizontal</strong> la función vale cero: ahí hay una raíz.</p>
      </>
    ),
  },
  {
    title: 'Elegir un intervalo',
    highlight: 'panel-intervals',
    body: (
      <>
        <p>El método necesita un intervalo <code className={CODE}>[a, b]</code> que encierre la raíz. La condición es:</p>
        <p className="my-3 rounded-lg bg-slate-900 px-3 py-2 text-center font-mono text-[13px] text-cyan-300">f(a) · f(b) &lt; 0</p>
        <p>Un <strong>cambio de signo</strong> significa que la función pasa de negativa a positiva (o al revés), así que forzosamente cruza el cero en medio.</p>
        <p className="mt-3">Puedes pulsar uno de los intervalos recomendados o escribir <code className={CODE}>a</code> y <code className={CODE}>b</code> a mano.</p>
      </>
    ),
  },
  {
    title: 'Configurar la tolerancia',
    highlight: 'field-tolerance',
    body: (
      <>
        <p>La tolerancia es el criterio de parada: el método se detiene cuando el error relativo porcentual baja de ese valor.</p>
        <p className="mt-3">Una tolerancia <strong>menor</strong> da una raíz más precisa, pero exige <strong>más iteraciones</strong>. El máximo de iteraciones es un tope de seguridad para que el cálculo no se alargue de más.</p>
      </>
    ),
  },
  {
    title: 'Calcular la raíz',
    highlight: 'btn-calculate',
    body: (
      <>
        <p>En cada paso se parte el intervalo por la mitad:</p>
        <p className="my-3 rounded-lg bg-slate-900 px-3 py-2 text-center font-mono text-[13px] text-cyan-300">c = (a + b) / 2</p>
        <p>Luego se comprueba en qué mitad sigue habiendo cambio de signo:</p>
        <ul className="mt-2 space-y-1.5">
          <li>Si <code className={CODE}>f(a)·f(c) &lt; 0</code>, la raíz está a la izquierda y <code className={CODE}>b = c</code>.</li>
          <li>Si no, la raíz está a la derecha y <code className={CODE}>a = c</code>.</li>
        </ul>
        <p className="mt-3">La otra mitad se descarta y el proceso se repite.</p>
      </>
    ),
  },
  {
    title: 'Interpretar los resultados',
    highlight: 'results-card',
    body: (
      <>
        <ul className="space-y-2">
          <li><strong>Raíz aproximada:</strong> el valor de x donde f(x) ≈ 0.</li>
          <li><strong>f(raíz):</strong> cuánto vale la función ahí. Mientras más cerca de cero, mejor.</li>
          <li><strong>Error relativo:</strong> diferencia porcentual entre las dos últimas aproximaciones.</li>
          <li><strong>Intervalo final:</strong> el tramo donde quedó acorralada la raíz; su amplitud es la incertidumbre restante.</li>
          <li><strong>Iteraciones:</strong> cuántas veces hubo que partir el intervalo.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Leer la tabla',
    highlight: 'iteration-table',
    body: (
      <>
        <ul className="space-y-1.5">
          <li><code className={CODE}>i</code> — número de iteración.</li>
          <li><code className={CODE}>aᵢ</code>, <code className={CODE}>bᵢ</code> — extremos del intervalo en ese paso.</li>
          <li><code className={CODE}>cᵢ</code> — punto medio, la aproximación de la raíz.</li>
          <li><code className={CODE}>f(aᵢ)</code>, <code className={CODE}>f(bᵢ)</code> — valores en los extremos; sus signos deben ser opuestos.</li>
          <li><code className={CODE}>f(cᵢ)</code> — valor en el punto medio; decide qué mitad se conserva.</li>
          <li><code className={CODE}>Eᵢ</code> — error relativo porcentual de ese paso.</li>
        </ul>
        <p className="mt-3">Usa <strong>Ver procedimiento paso a paso</strong> para recorrer cada iteración con su explicación.</p>
      </>
    ),
  },
]

export function HowToGuide({ open, onClose }: HowToGuideProps) {
  const [index, setIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setIndex((current) => Math.min(current + 1, STEPS.length - 1))
      if (event.key === 'ArrowLeft') setIndex((current) => Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const targetId = STEPS[index].highlight
    if (!targetId) return
    const element = document.getElementById(targetId)
    if (!element) return
    element.classList.add('tour-highlight')
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return () => element.classList.remove('tour-highlight')
  }, [open, index])

  if (!open) return null

  const step = STEPS[index]
  const isFirst = index === 0
  const isLast = index === STEPS.length - 1

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] lg:hidden" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="guide-step-title"
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[78vh] flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl outline-none animate-rise-in sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-4 sm:max-h-none sm:w-[400px] sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-transparent px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="panel-icon bg-indigo-600 shadow-indigo-200">
              <Compass size={19} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Guía de uso</p>
              <h2 id="guide-step-title" className="text-base font-bold text-slate-950">{step.title}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Cerrar la guía">
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-1.5 px-5 pt-4" aria-hidden="true">
          {STEPS.map((item, position) => (
            <span
              key={item.title}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${position <= index ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-6 text-slate-600 scroll-soft">
          <span className="mb-3 inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Paso {index + 1} de {STEPS.length}
          </span>
          {step.body}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={() => setIndex((current) => current - 1)} disabled={isFirst} className="chip px-3 py-2 disabled:opacity-35">
            <ArrowLeft size={15} aria-hidden="true" /> Anterior
          </button>
          <span className="font-mono text-xs font-semibold text-slate-400">{index + 1}/{STEPS.length}</span>
          {isLast ? (
            <button type="button" onClick={onClose} className="button-primary min-h-0 px-4 py-2 text-xs">
              Entendido
            </button>
          ) : (
            <button type="button" onClick={() => setIndex((current) => current + 1)} className="button-primary min-h-0 px-4 py-2 text-xs">
              Siguiente <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
