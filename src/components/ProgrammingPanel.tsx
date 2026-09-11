import { useMemo, useState } from 'react'
import { Check, Code2, Copy, TerminalSquare } from 'lucide-react'

type Language = 'octave' | 'matlab' | 'python'

interface ProgrammingPanelProps {
  expression: string
  a: string
  b: string
  tolerance: string
  maxIterations: string
}

const languageLabels: Record<Language, string> = {
  octave: 'Octave',
  matlab: 'MATLAB',
  python: 'Python',
}

function toOctaveExpression(expression: string) {
  return expression
    .replace(/\.\^/g, '__POWER__')
    .replace(/\^/g, '.^')
    .replace(/__POWER__/g, '.^')
    .replace(/"/g, '\\"')
}

function buildOctaveCode(expression: string, a: string, b: string, tolerance: string, maxIterations: string) {
  const octaveExpression = toOctaveExpression(expression)

  return `% Metodo de la biseccion
% Forma desarrollada en clase

% Esta funcion imprime: i, a0, b0, c0 y el ancho del intervalo
function raiz = Biseccion(f, a0, b0, tol, max_iter)
    if nargin < 4
        tol = ${tolerance};
    endif
    if nargin < 5
        max_iter = ${maxIterations};
    endif

    fa0 = feval(f, a0);
    fb0 = feval(f, b0);

    if fa0 * fb0 >= 0
        error('f(a0) y f(b0) deben tener signos opuestos');
    endif

    fprintf('\n%3s %12s %12s %12s %12s\n', ...
            'i', 'a0', 'b0', 'c0', 'Error');

    for i = 0:max_iter-1
        c0 = (a0 + b0) / 2;
        fc0 = feval(f, c0);
        error_intervalo = abs(b0 - a0);

        fprintf('%3d %12.5f %12.5f %12.5f %12.5f\n', ...
                i, a0, b0, c0, error_intervalo);

        if fc0 == 0 || error_intervalo <= tol
            break;
        endif

        if fa0 * fc0 < 0
            b0 = c0;
            fb0 = fc0;
        else
            a0 = c0;
            fa0 = fc0;
        endif
    endfor

    raiz = c0;
endfunction

% Ejemplo con los datos actuales de la aplicacion
% Se usa .^ para que la funcion tambien acepte vectores al graficar
f = inline("${octaveExpression}", "x");

% Graficar la funcion para observar el intervalo
figure;
ezplot(f, [${a}, ${b}]);
grid on;
xlabel('x');
ylabel('f(x)');
title('Metodo de la biseccion');

% Intervalo inicial
a0 = ${a};
b0 = ${b};
tol = ${tolerance};
max_iter = ${maxIterations};

% Comprobacion del cambio de signo, sin mostrar ans
fprintf('f(a0) = %.6f\n', feval(f, a0));
fprintf('f(b0) = %.6f\n', feval(f, b0));

% Ejecutar el metodo y mostrar solamente el resultado final
raiz = Biseccion(f, a0, b0, tol, max_iter);
fprintf('\nRaiz aproximada = %.6f\n', raiz);`
}

function buildCode(language: Language, expression: string, a: string, b: string, tolerance: string, maxIterations: string) {
  const safeExpression = expression.trim() || 'exp(-x) + sin(x) - x^2'
  const safeA = a || '1'
  const safeB = b || '2'
  const safeTolerance = tolerance || '0.0005'
  const safeMax = maxIterations || '100'

  if (language === 'octave') {
    return buildOctaveCode(safeExpression, safeA, safeB, safeTolerance, safeMax)
  }

  if (language === 'python') {
    const pythonExpression = safeExpression.replace(/\^/g, '**')
    return `# Bisección con criterio de error relativo porcentual
from math import *

f = lambda x: ${pythonExpression}
a, b = ${safeA}, ${safeB}
tol = ${safeTolerance}
max_iter = ${safeMax}

fa, fb = f(a), f(b)
if fa * fb >= 0:
    raise ValueError("f(a) y f(b) deben tener signos opuestos")

c_anterior = None
print(f"{'i':>3} {'a':>12} {'b':>12} {'c':>12} {'f(c)':>14} {'Ea %':>12}")

for i in range(1, max_iter + 1):
    c = (a + b) / 2
    fc = f(c)
    error = None if c_anterior is None else abs((c - c_anterior) / c) * 100
    error_txt = "---" if error is None else f"{error:.6f}"
    print(f"{i:3d} {a:12.6f} {b:12.6f} {c:12.6f} {fc:14.6f} {error_txt:>12}")

    if fc == 0 or (error is not None and error <= tol):
        break
    if fa * fc < 0:
        b, fb = c, fc
    else:
        a, fa = c, fc
    c_anterior = c

print(f"Raíz aproximada: {c:.8f}")`
  }

  return `% Bisección con criterio de error relativo porcentual
f = @(x) ${safeExpression};
a = ${safeA};  b = ${safeB};
tol = ${safeTolerance};  max_iter = ${safeMax};

fa = f(a);  fb = f(b);
if fa * fb >= 0
    error('f(a) y f(b) deben tener signos opuestos');
end

c_anterior = NaN;
fprintf('%3s %12s %12s %12s %14s %12s\\n', 'i', 'a', 'b', 'c', 'f(c)', 'Ea %');

for i = 1:max_iter
    c = (a + b) / 2;
    fc = f(c);
    if isnan(c_anterior)
        error_relativo = NaN;
    else
        error_relativo = abs((c - c_anterior) / c) * 100;
    end
    fprintf('%3d %12.6f %12.6f %12.6f %14.6f %12.6f\\n', i, a, b, c, fc, error_relativo);

    if fc == 0 || (~isnan(error_relativo) && error_relativo <= tol)
        break;
    end
    if fa * fc < 0
        b = c;  fb = fc;
    else
        a = c;  fa = fc;
    end
    c_anterior = c;
end

fprintf('Raíz aproximada: %.8f\\n', c);`
}

export function ProgrammingPanel({ expression, a, b, tolerance, maxIterations }: ProgrammingPanelProps) {
  const [language, setLanguage] = useState<Language>('octave')
  const [copied, setCopied] = useState(false)
  const code = useMemo(
    () => buildCode(language, expression, a, b, tolerance, maxIterations),
    [language, expression, a, b, tolerance, maxIterations],
  )

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-panel" aria-labelledby="programming-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600/20 text-blue-400">
            <TerminalSquare size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Llévalo a clase</p>
            <h2 id="programming-title" className="text-lg font-semibold text-white">Bisección en otros programas</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Lenguaje del ejemplo">
          {(Object.keys(languageLabels) as Language[]).map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={language === item}
              key={item}
              onClick={() => setLanguage(item)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${language === item ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {languageLabels[item]}
            </button>
          ))}
          <button type="button" onClick={copyCode} className="ml-1 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 border-r border-slate-800 bg-slate-900/60" />
        <pre className="max-h-[460px] overflow-auto py-5 pl-16 pr-5 font-mono text-[13px] leading-6 text-slate-200 sm:text-sm">
          <code>{code}</code>
        </pre>
      </div>

      <div className="flex items-start gap-2 border-t border-slate-800 bg-slate-900/60 px-5 py-3 text-sm leading-6 text-slate-400 sm:px-6">
        <Code2 size={16} className="mt-1 shrink-0 text-blue-400" aria-hidden="true" />
        {language === 'octave'
          ? 'Formato de clase: inline, feval, a0, b0, c0 y función Biseccion. No incluye prompts octave: ni líneas ans; puedes copiarlo completo.'
          : 'El ejemplo usa tu función, intervalo, tolerancia y máximo de iteraciones actuales. Puedes copiarlo y ejecutarlo directamente.'}
      </div>
    </section>
  )
}
