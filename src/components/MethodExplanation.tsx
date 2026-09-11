import { BookOpen, Divide, MoveRight, Repeat, Target } from 'lucide-react'
import { Guide } from './Guide'

const STEPS = [
  {
    number: '01',
    title: 'Divide el intervalo',
    body: 'Se toma el punto medio entre los extremos actuales.',
    formula: 'cᵢ = (aᵢ + bᵢ) / 2',
    icon: Divide,
    guide: {
      title: 'Bisección',
      detail: 'Bisecar significa partir en dos. Cada paso descarta la mitad del intervalo donde no puede estar la raíz.',
      formula: 'amplitud = (b − a) / 2ⁱ',
    },
  },
  {
    number: '02',
    title: 'Conserva el cambio de signo',
    body: 'Se elige la mitad donde la función sigue cruzando el eje.',
    formula: 'f(aᵢ) · f(cᵢ) < 0  ⟶  bᵢ = cᵢ',
    icon: Target,
    guide: {
      title: 'Teorema de Bolzano',
      detail: 'Si una función continua tiene signos opuestos en los extremos, forzosamente cruza el cero en medio. Esa es la mitad que se conserva.',
      formula: 'f(a) · f(b) < 0 ⟹ ∃ raíz',
    },
  },
  {
    number: '03',
    title: 'Mide la aproximación',
    body: 'Se compara con la iteración previa hasta cumplir la tolerancia.',
    formula: 'Eᵢ = |(cᵢ − cᵢ₋₁) / cᵢ| × 100',
    icon: Repeat,
    guide: {
      title: 'Convergencia garantizada',
      detail: 'La bisección siempre converge si el intervalo inicial encierra una raíz, aunque más lento que otros métodos: gana un bit de precisión por iteración.',
      formula: 'orden de convergencia lineal',
    },
  },
]

export function MethodExplanation() {
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="method-title">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-300">
          <BookOpen size={19} aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">Fundamento</p>
          <h2 id="method-title" className="text-lg font-semibold text-slate-950">Cómo funciona la bisección</h2>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map(({ number, title, body, formula, icon: Icon, guide }) => (
          <Guide key={number} block focusable placement="top" title={guide.title} detail={guide.detail} formula={guide.formula}>
            <article className="h-full rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="step-number">{number}</span>
                <Icon size={17} className="text-indigo-500" aria-hidden="true" />
              </div>
              <p className="mt-3 font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">{body}</p>
              <p className="formula mt-2">{formula}</p>
            </article>
          </Guide>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50/70 px-4 py-3 text-sm text-indigo-900">
        <MoveRight size={16} className="shrink-0" aria-hidden="true" />
        El proceso se repite hasta que el error relativo cae por debajo de la tolerancia definida.
      </p>
    </section>
  )
}
