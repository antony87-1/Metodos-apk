import type { BisectionInput, BisectionResult, Iteration } from '../types/bisection'
import type { MathFunction } from './mathParser'

export function solveBisection(fn: MathFunction, input: BisectionInput): BisectionResult {
  let { a, b } = input
  const { tolerance, maxIterations } = input

  if (!Number.isFinite(a) || !Number.isFinite(b) || a >= b) {
    throw new Error('El límite a debe ser menor que b.')
  }
  if (!Number.isFinite(tolerance) || tolerance <= 0) {
    throw new Error('La tolerancia debe ser un número mayor que cero.')
  }
  if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
    throw new Error('El máximo de iteraciones debe ser un entero mayor que cero.')
  }

  let fa = fn(a)
  let fb = fn(b)
  if (fa * fb >= 0) {
    throw new Error('El intervalo no encierra una raíz: se requiere f(a) · f(b) < 0.')
  }

  const iterations: Iteration[] = []
  let previousC: number | null = null
  let currentC = (a + b) / 2
  let currentFc = fn(currentC)
  let finalError = Number.POSITIVE_INFINITY
  let converged = false

  for (let i = 1; i <= maxIterations; i += 1) {
    currentC = (a + b) / 2
    currentFc = fn(currentC)
    const error = previousC === null
      ? null
      : currentC === 0
        ? Math.abs(currentC - previousC) * 100
        : Math.abs((currentC - previousC) / currentC) * 100

    iterations.push({ i, a, b, c: currentC, fa, fc: currentFc, fb, error })

    if (currentFc === 0) {
      finalError = 0
      a = currentC
      b = currentC
      converged = true
      break
    }

    if (fa * currentFc < 0) {
      b = currentC
      fb = currentFc
    } else {
      a = currentC
      fa = currentFc
    }

    finalError = error ?? Number.POSITIVE_INFINITY
    if (error !== null && error <= tolerance) {
      converged = true
      break
    }
    previousC = currentC
  }

  return {
    root: currentC,
    fRoot: currentFc,
    finalError,
    iterations,
    finalInterval: { a, b },
    tolerance,
    converged,
  }
}
