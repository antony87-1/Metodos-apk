export interface SampleFunction {
  id: string
  name: string
  expression: string
  a: number
  b: number
  description: string
}

export const SAMPLE_FUNCTIONS: SampleFunction[] = [
  {
    id: 'mixta',
    name: 'Mixta exponencial',
    expression: 'exp(-x) + sin(x) - x^2',
    a: 1,
    b: 2,
    description: 'Combina decaimiento exponencial, oscilación y una parábola.',
  },
  {
    id: 'cubica-simple',
    name: 'Cúbica simple',
    expression: 'x^3 - x - 2',
    a: 1,
    b: 2,
    description: 'Polinomio de grado 3 con una sola raíz real.',
  },
  {
    id: 'coseno',
    name: 'Punto fijo del coseno',
    expression: 'cos(x) - x',
    a: 0,
    b: 1,
    description: 'Clásico de clase: la curva del coseno corta a la recta y = x.',
  },
  {
    id: 'parabola',
    name: 'Parábola básica',
    expression: 'x^2 - 4',
    a: 0,
    b: 3,
    description: 'Raíz exacta en x = 2, ideal para comprobar la precisión.',
  },
  {
    id: 'exponencial',
    name: 'Exponencial contra recta',
    expression: 'exp(x) - 3*x',
    a: 0,
    b: 1,
    description: 'Compara el crecimiento de eˣ frente a una recta.',
  },
  {
    id: 'cubica-referencia',
    name: 'Cúbica de referencia',
    expression: 'x^3 + 4*x^2 - 10',
    a: 1,
    b: 2,
    description: 'Ejemplo estándar en los libros de análisis numérico.',
  },
]
