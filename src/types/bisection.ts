export interface Interval {
  a: number
  b: number
}

export interface Iteration {
  i: number
  a: number
  b: number
  c: number
  fa: number
  fc: number
  fb: number
  error: number | null
}

export interface BisectionInput extends Interval {
  tolerance: number
  maxIterations: number
}

export interface BisectionResult {
  root: number
  fRoot: number
  finalError: number
  iterations: Iteration[]
  finalInterval: Interval
  tolerance: number
  converged: boolean
}

export interface ChartPoint {
  x: number
  y: number | null
}
