import type { Iteration } from '../types/bisection'

export interface StepDecision {
  exact: boolean
  goesLeft: boolean
  test: string
  reason: string
  theorem: string
  keep: [number, number]
  discard: [number, number]
}

const show = (value: number) => value.toFixed(6)

/** Describes, for display only, the branch that solveBisection takes on a given iteration. */
export function describeDecision(iteration: Iteration): StepDecision {
  const { a, b, c, fa, fc } = iteration

  if (fc === 0) {
    return {
      exact: true,
      goesLeft: false,
      test: 'f(cᵢ) = 0',
      reason: 'El punto medio cae exactamente sobre la raíz, así que el método termina aquí sin necesidad de seguir dividiendo.',
      theorem: 'Cuando f(c) = 0, c es una raíz exacta de la función y el intervalo se cierra sobre ese punto.',
      keep: [c, c],
      discard: [a, b],
    }
  }

  const goesLeft = fa * fc < 0

  return {
    exact: false,
    goesLeft,
    test: goesLeft ? `f(aᵢ) · f(cᵢ) < 0   (${show(fa)} × ${show(fc)})` : `f(aᵢ) · f(cᵢ) > 0   (${show(fa)} × ${show(fc)})`,
    reason: goesLeft
      ? 'Hay cambio de signo entre aᵢ y cᵢ, por lo tanto la raíz está en la mitad izquierda: el nuevo extremo derecho pasa a ser bᵢ = cᵢ.'
      : 'No hay cambio de signo entre aᵢ y cᵢ, así que la raíz está en la mitad derecha: el nuevo extremo izquierdo pasa a ser aᵢ = cᵢ.',
    theorem:
      'Teorema de Bolzano: si una función continua toma valores de signo opuesto en los extremos de un intervalo, existe al menos un punto interior donde vale cero. Por eso siempre se conserva la mitad que mantiene el cambio de signo.',
    keep: goesLeft ? [a, c] : [c, b],
    discard: goesLeft ? [c, b] : [a, c],
  }
}
