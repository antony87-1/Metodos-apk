import { parse, type EvalFunction } from 'mathjs'

const ALLOWED_SYMBOLS = new Set([
  'x', 'e', 'pi', 'i',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'sqrt', 'cbrt', 'abs',
  'exp', 'log', 'log10', 'ln', 'floor', 'ceil', 'round',
])

const FORBIDDEN_NODES = new Set([
  'AssignmentNode',
  'FunctionAssignmentNode',
  'BlockNode',
  'AccessorNode',
  'ObjectNode',
  'ArrayNode',
])

export type MathFunction = (x: number) => number

export function compileFunction(expression: string): MathFunction {
  const cleaned = expression.trim()
  if (!cleaned) throw new Error('Ingresa una función antes de continuar.')

  let compiled: EvalFunction
  try {
    const node = parse(cleaned)
    node.traverse((child) => {
      if (FORBIDDEN_NODES.has(child.type)) {
        throw new Error('La expresión contiene una operación no permitida.')
      }
      if (child.type === 'SymbolNode') {
        const name = (child as unknown as { name: string }).name
        if (!ALLOWED_SYMBOLS.has(name)) {
          throw new Error(`El símbolo “${name}” no está permitido. Usa x como variable.`)
        }
      }
    })
    compiled = node.compile()
  } catch (error) {
    if (error instanceof Error && error.message.includes('no está permitido')) throw error
    if (error instanceof Error && error.message.includes('operación no permitida')) throw error
    throw new Error('La función no es válida. Revisa paréntesis, operadores y nombres.')
  }

  return (x: number) => {
    const value = compiled.evaluate({ x })
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`La función no produce un valor real y finito en x = ${x}.`)
    }
    return value
  }
}
