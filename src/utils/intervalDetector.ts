import type { Interval } from '../types/bisection'
import type { MathFunction } from './mathParser'

export function detectIntervals(
  fn: MathFunction,
  min = -10,
  max = 10,
  step = 0.1,
): Interval[] {
  const intervals: Interval[] = []
  let previousX = min
  let previousY: number | null = safeEvaluate(fn, previousX)

  for (let x = min + step; x <= max + step / 2; x += step) {
    const currentX = Math.min(Number(x.toFixed(10)), max)
    const currentY = safeEvaluate(fn, currentX)

    if (previousY !== null && currentY !== null) {
      if (previousY * currentY < 0) {
        intervals.push({ a: Number(previousX.toFixed(4)), b: Number(currentX.toFixed(4)) })
      }
    }

    previousX = currentX
    previousY = currentY
    if (currentX === max) break
  }

  return intervals.filter((interval, index, all) =>
    index === 0 || Math.abs(interval.a - all[index - 1].a) > step / 2,
  )
}

function safeEvaluate(fn: MathFunction, x: number): number | null {
  try {
    return fn(x)
  } catch {
    return null
  }
}
