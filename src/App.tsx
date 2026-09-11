import { useMemo, useState } from 'react'
import { Binary, Compass, FlaskConical, Footprints, ScanSearch, SlidersHorizontal } from 'lucide-react'
import { CollapsibleSection } from './components/CollapsibleSection'
import { FunctionChart, type ActiveStep } from './components/FunctionChart'
import { FunctionForm } from './components/FunctionForm'
import { HowToGuide } from './components/HowToGuide'
import { IterationTable } from './components/IterationTable'
import { MethodExplanation } from './components/MethodExplanation'
import { ProgrammingPanel } from './components/ProgrammingPanel'
import { ResultsCard } from './components/ResultsCard'
import { SampleFunctions } from './components/SampleFunctions'
import { StepByStep } from './components/StepByStep'
import { SuggestedIntervals } from './components/SuggestedIntervals'
import { SAMPLE_FUNCTIONS, type SampleFunction } from './data/sampleFunctions'
import type { BisectionResult, ChartPoint, Interval } from './types/bisection'
import { solveBisection } from './utils/bisection'
import { detectIntervals } from './utils/intervalDetector'
import { compileFunction } from './utils/mathParser'
import { sampleFunction } from './utils/sampler'
import { describeDecision } from './utils/stepNarrative'

const INITIAL = SAMPLE_FUNCTIONS[0]
const INITIAL_FN = compileFunction(INITIAL.expression)
const INITIAL_POINTS = sampleFunction(INITIAL_FN)
const INITIAL_INTERVALS = detectIntervals(INITIAL_FN)

function App() {
  const [expression, setExpression] = useState(INITIAL.expression)
  const [graphedExpression, setGraphedExpression] = useState(INITIAL.expression)
  const [a, setA] = useState(String(INITIAL.a))
  const [b, setB] = useState(String(INITIAL.b))
  const [tolerance, setTolerance] = useState('0.0005')
  const [maxIterations, setMaxIterations] = useState('100')
  const [chartData, setChartData] = useState<ChartPoint[]>(INITIAL_POINTS)
  const [intervals, setIntervals] = useState<Interval[]>(INITIAL_INTERVALS)
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>({ a: INITIAL.a, b: INITIAL.b })
  const [result, setResult] = useState<BisectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasGraphed, setHasGraphed] = useState(true)
  const [activeSampleId, setActiveSampleId] = useState<string | null>(INITIAL.id)
  const [showGuide, setShowGuide] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const visibleInterval = useMemo(() => {
    const parsedA = Number(a)
    const parsedB = Number(b)
    return Number.isFinite(parsedA) && Number.isFinite(parsedB) && parsedA < parsedB ? { a: parsedA, b: parsedB } : null
  }, [a, b])

  const activeStep = useMemo<ActiveStep | null>(() => {
    if (!showSteps || !result) return null
    const iteration = result.iterations[stepIndex]
    if (!iteration) return null
    const decision = describeDecision(iteration)
    return { a: iteration.a, b: iteration.b, c: iteration.c, fc: iteration.fc, keep: decision.keep, discard: decision.discard }
  }, [showSteps, result, stepIndex])

  const clearResult = () => {
    setResult(null)
    setShowSteps(false)
    setPlaying(false)
    setStepIndex(0)
  }

  /** Compiles and plots an expression. Throws when the expression is invalid. */
  const buildGraph = (source: string) => {
    const fn = compileFunction(source)
    setChartData(sampleFunction(fn))
    setIntervals(detectIntervals(fn))
    setGraphedExpression(source)
    setHasGraphed(true)
  }

  const graphFunction = () => {
    try {
      buildGraph(expression)
      clearResult()
      setError(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo interpretar la función.')
    }
  }

  const selectInterval = (interval: Interval) => {
    setA(String(interval.a))
    setB(String(interval.b))
    setSelectedInterval(interval)
    clearResult()
    setError(null)
  }

  const applySample = (sample: SampleFunction) => {
    setExpression(sample.expression)
    setA(String(sample.a))
    setB(String(sample.b))
    setSelectedInterval({ a: sample.a, b: sample.b })
    setActiveSampleId(sample.id)
    clearResult()
    try {
      buildGraph(sample.expression)
      setError(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo interpretar la función.')
    }
  }

  const calculate = () => {
    try {
      const fn = compileFunction(expression)
      const parsedA = Number(a)
      const parsedB = Number(b)
      const calculation = solveBisection(fn, {
        a: parsedA,
        b: parsedB,
        tolerance: Number(tolerance),
        maxIterations: Number(maxIterations),
      })

      if (expression !== graphedExpression || chartData.length === 0) buildGraph(expression)
      setSelectedInterval({ a: parsedA, b: parsedB })
      setStepIndex(0)
      setPlaying(false)
      setResult(calculation)
      setError(null)
      window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (caught) {
      clearResult()
      setError(caught instanceof Error ? caught.message : 'No se pudo completar el cálculo.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-950">
              <Binary size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Laboratorio numérico</p>
              <h1 className="text-base font-bold tracking-tight sm:text-lg">Método de Bisección</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
          >
            <Compass size={17} aria-hidden="true" />
            ¿Cómo usar la aplicación?
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1800px] flex-1 px-3 py-3 sm:px-5 lg:px-6">
        <div className="grid gap-3 lg:h-[calc(100vh-5.75rem)] lg:grid-cols-[330px_minmax(0,1fr)_290px] xl:grid-cols-[360px_minmax(0,1fr)_320px]">
          <div className="flex min-h-0 flex-col gap-3 lg:overflow-y-auto lg:scroll-soft lg:pr-1">
            <CollapsibleSection id="panel-config" eyebrow="Configuración" title="Define el problema" icon={SlidersHorizontal}>
              <FunctionForm
                expression={expression}
                a={a}
                b={b}
                tolerance={tolerance}
                maxIterations={maxIterations}
                error={error}
                onExpressionChange={(value) => { setExpression(value); setActiveSampleId(null); clearResult() }}
                onAChange={(value) => { setA(value); setSelectedInterval(null); clearResult() }}
                onBChange={(value) => { setB(value); setSelectedInterval(null); clearResult() }}
                onToleranceChange={(value) => { setTolerance(value); clearResult() }}
                onMaxIterationsChange={(value) => { setMaxIterations(value); clearResult() }}
                onGraph={graphFunction}
                onCalculate={calculate}
              />
            </CollapsibleSection>

            <CollapsibleSection id="panel-intervals" eyebrow="Análisis en [−10, 10]" title="Intervalos recomendados" icon={ScanSearch} accent="orange">
              <SuggestedIntervals intervals={intervals} selected={selectedInterval} hasGraphed={hasGraphed} onSelect={selectInterval} />
            </CollapsibleSection>
          </div>

          <div className="min-h-[58vh] min-w-0 lg:min-h-0">
            <FunctionChart
              data={chartData}
              interval={visibleInterval}
              root={result?.root ?? null}
              expression={graphedExpression}
              step={activeStep}
            />
          </div>

          <CollapsibleSection
            id="panel-samples"
            eyebrow="Carga en un clic"
            title="Funciones de prueba"
            icon={FlaskConical}
            accent="cyan"
            className="lg:min-h-0"
          >
            <SampleFunctions activeId={activeSampleId} onSelect={applySample} />
          </CollapsibleSection>
        </div>

        {result && (
          <div id="results" className="mt-3 scroll-mt-20 space-y-3">
            <ResultsCard result={result} />

            <button
              type="button"
              onClick={() => setShowSteps((current) => !current)}
              aria-expanded={showSteps}
              className="button-secondary w-full sm:w-auto"
            >
              <Footprints size={17} aria-hidden="true" />
              {showSteps ? 'Ocultar procedimiento paso a paso' : 'Ver procedimiento paso a paso'}
            </button>

            {showSteps && (
              <StepByStep
                iterations={result.iterations}
                index={stepIndex}
                playing={playing}
                speed={speed}
                onIndexChange={setStepIndex}
                onPlayingChange={setPlaying}
                onSpeedChange={setSpeed}
              />
            )}

            <IterationTable iterations={result.iterations} />
          </div>
        )}

        <div className="mt-3 space-y-3">
          <MethodExplanation />
          <ProgrammingPanel expression={expression} a={a} b={b} tolerance={tolerance} maxIterations={maxIterations} />
        </div>
      </main>

      <footer className="mx-auto max-w-[1800px] px-4 py-5 text-center text-sm text-slate-400">
        Método cerrado · Convergencia garantizada cuando f(a) · f(b) &lt; 0
      </footer>

      <HowToGuide open={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  )
}

export default App
