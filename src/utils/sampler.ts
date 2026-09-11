import type { ChartPoint } from '../types/bisection'
import type { MathFunction } from './mathParser'

const MAX_MAGNITUDE = 1e4

/** Evaluates the function across a range, marking unplottable points as null. */
export function sampleFunction(fn: MathFunction, min = -10, max = 10, steps = 600): ChartPoint[] {
  const points: ChartPoint[] = []
  const width = (max - min) / steps

  for (let i = 0; i <= steps; i += 1) {
    const x = min + i * width
    try {
      const y = fn(x)
      points.push({ x: Number(x.toFixed(4)), y: Math.abs(y) <= MAX_MAGNITUDE ? y : null })
    } catch {
      points.push({ x: Number(x.toFixed(4)), y: null })
    }
  }

  return points
}
