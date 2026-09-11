import { BookOpen, Divide, MoveRight } from 'lucide-react'

export function MethodExplanation() {
  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="method-title">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700"><BookOpen size={19} /></span>
        <div>
          <p className="eyebrow">Fundamento</p>
          <h2 id="method-title" className="text-lg font-semibold text-slate-950">Cómo funciona la bisección</h2>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="step-number">01</span>
          <p className="mt-3 font-semibold text-slate-900">Divide el intervalo</p>
          <p className="formula mt-2">cᵢ = (aᵢ + bᵢ) / 2</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="step-number">02</span>
          <p className="mt-3 font-semibold text-slate-900">Conserva el cambio de signo</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Divide size={15} /> f(aᵢ) · f(cᵢ) &lt; 0 <MoveRight size={15} /> bᵢ = cᵢ</div>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="step-number">03</span>
          <p className="mt-3 font-semibold text-slate-900">Mide la aproximación</p>
          <p className="formula mt-2">Eᵢ = |(cᵢ − cᵢ₋₁) / cᵢ| × 100</p>
        </article>
      </div>
    </section>
  )
}
