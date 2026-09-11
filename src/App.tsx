import { useMemo, useState } from 'react'
import { Binary, GraduationCap } from 'lucide-react'
import { FunctionChart } from './components/FunctionChart'
import { FunctionForm } from './components/FunctionForm'
import { IterationTable } from './components/IterationTable'
import { MethodExplanation } from './components/MethodExplanation'
import { ResultsCard } from './components/ResultsCard'
import { SuggestedIntervals } from './components/SuggestedIntervals'
import type { BisectionResult, ChartPoint, Interval } from './types/bisection'
import { solveBisection } from './utils/bisection'
import { detectIntervals } from './utils/intervalDetector'
import { compileFunction } from './utils/mathParser'

const INITIAL_EXPRESSION = 'exp(-x) + sin(x) - x^2'

function App() {
  const [expression, setExpression] = useState(INITIAL_EXPRESSION)
  const [graphedExpression, setGraphedExpression] = useState(INITIAL_EXPRESSION)
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [tolerance, setTolerance] = useState('0.0005')
  const [maxIterations, setMaxIterations] = useState('100')
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [intervals, setIntervals] = useState<Interval[]>([])
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>({ a: 1, b: 2 })
  const [result, setResult] = useState<BisectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasGraphed, setHasGraphed] = useState(false)

  const visibleInterval = useMemo(() => {
    const parsedA = Number(a)
    const parsedB = Number(b)
    return Number.isFinite(parsedA) && Number.isFinite(parsedB) && parsedA < parsedB ? { a: parsedA, b: parsedB } : null
  }, [a, b])

  const graphFunction = () => {
    try {
      const fn = compileFunction(expression)
      const points: ChartPoint[] = []
      for (let i = 0; i <= 400; i += 1) {
        const x = -10 + i * 0.05
        try {
          const y = fn(x)
          points.push({ x: Number(x.toFixed(4)), y: Math.abs(y) <= 1e4 ? y : null })
        } catch {
          points.push({ x: Number(x.toFixed(4)), y: null })
        }
      }
      const detected = detectIntervals(fn)
      setChartData(points)
      setIntervals(detected)
      setGraphedExpression(expression)
      setHasGraphed(true)
      setResult(null)
      setError(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo interpretar la función.')
    }
  }

  const selectInterval = (interval: Interval) => {
    setA(String(interval.a))
    setB(String(interval.b))
    setSelectedInterval(interval)
    setResult(null)
    setError(null)
  }

  const calculate = () => {
    try {
      const fn = compileFunction(expression)
      const parsedA = Number(a)
      const parsedB = Number(b)
      const parsedTolerance = Number(tolerance)
      const parsedIterations = Number(maxIterations)
      const calculation = solveBisection(fn, {
        a: parsedA,
        b: parsedB,
        tolerance: parsedTolerance,
        maxIterations: parsedIterations,
      })

      if (expression !== graphedExpression || chartData.length === 0) graphFunction()
      setSelectedInterval({ a: parsedA, b: parsedB })
      setResult(calculation)
      setError(null)
      window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : 'No se pudo completar el cálculo.')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-950"><Binary size={23} /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Laboratorio numérico</p>
                <h1 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">Método de Bisección</h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:flex">
              <GraduationCap size={17} /> Análisis interactivo de raíces
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-orange-400" />
      </header>

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-6 lg:sticky lg:top-6">
            <FunctionForm
              expression={expression} a={a} b={b} tolerance={tolerance} maxIterations={maxIterations} error={error}
              onExpressionChange={(value) => { setExpression(value); setResult(null) }}
              onAChange={(value) => { setA(value); setSelectedInterval(null); setResult(null) }}
              onBChange={(value) => { setB(value); setSelectedInterval(null); setResult(null) }}
              onToleranceChange={(value) => { setTolerance(value); setResult(null) }}
              onMaxIterationsChange={(value) => { setMaxIterations(value); setResult(null) }}
              onGraph={graphFunction} onCalculate={calculate}
            />
          </div>
          <div className="min-w-0 space-y-6">
            <FunctionChart data={chartData} interval={visibleInterval} root={result?.root ?? null} expression={graphedExpression} />
            <SuggestedIntervals intervals={intervals} selected={selectedInterval} hasGraphed={hasGraphed} onSelect={selectInterval} />
          </div>
        </div>

        {result && (
          <div id="results" className="scroll-mt-6 space-y-6">
            <ResultsCard result={result} />
            <IterationTable iterations={result.iterations} />
          </div>
        )}

        <MethodExplanation />
      </main>
      <footer className="mx-auto max-w-[1440px] px-4 pb-8 text-center text-sm text-slate-400 sm:px-6">Método cerrado · Convergencia garantizada cuando f(a) · f(b) &lt; 0</footer>
    </div>
  )
}

export default App
