# Laboratorio del Método de Bisección

Aplicación educativa construida con React, TypeScript, Vite, Tailwind CSS, mathjs y Recharts. Permite interpretar una función sin usar `eval()`, graficarla, detectar intervalos con cambio de signo y resolver una raíz exclusivamente mediante el Método de Bisección.

## Características

- **Distribución de laboratorio en tres áreas**: controles a la izquierda, gráfica grande al centro y funciones de prueba a la derecha, ocupando la altura completa de la ventana en escritorio.
- **Guía interactiva “¿Cómo usar la aplicación?”**: recorrido de 7 pasos en un panel lateral que resalta en pantalla el elemento explicado, con navegación por botones y por teclado (`←`, `→`, `Esc`).
- **Procedimiento paso a paso**: recorre iteración por iteración el cálculo de `cᵢ`, los valores de la función, el error, la decisión tomada y su justificación matemática, con controles de primera/anterior/siguiente/última, reproducción automática y selector de velocidad. La gráfica resalta `aᵢ`, `bᵢ`, `cᵢ`, la mitad conservada y la descartada.
- **Funciones de prueba**: seis ejemplos clásicos que al pulsarlos cargan la función, colocan el intervalo recomendado y grafican automáticamente.
- **Guías al apuntar con el puntero**: pasa el cursor (o tabula con el teclado) sobre campos, botones, encabezados de la tabla y métricas para ver una tarjeta explicativa con su definición y fórmula.
- **Gráfica interactiva**: cuadrícula cartesiana completa, guías cruzadas, coordenadas en vivo, y alternancia entre la vista del rango completo `[−10, 10]` y la vista detallada del intervalo `[a, b]`.
- **Detección automática de intervalos** con cambio de signo en `[−10, 10]`.
- **Tabla de iteraciones** con la fila final resaltada y cada columna documentada.
- **Código equivalente** para Octave, MATLAB y Python, generado con la función y los parámetros actuales y listo para copiar.
- **Parser seguro** de expresiones sin `eval()`: valida el AST y limita los símbolos permitidos.
- **Diseño responsive**: en tablet y móvil los paneles laterales se pliegan y las funciones de prueba se recorren como carrusel horizontal, sin desplazamiento horizontal de la página.

## Requisitos

- Node.js 18 o superior
- npm

## Cómo levantar el proyecto

```bash
npm install
npm run dev
```

Abre la dirección local que muestra Vite (normalmente `http://localhost:5173`).

## Compilar para producción

```bash
npm run build
npm run preview
```

## Uso

1. Escribe una expresión usando `x` como variable (por ejemplo, `exp(-x) + sin(x) - x^2`) o carga una de las **Funciones de prueba** del panel derecho.
2. Presiona **Graficar y detectar intervalos**.
3. Selecciona un intervalo recomendado o introduce `a` y `b` manualmente.
4. Ajusta la tolerancia porcentual y el máximo de iteraciones.
5. Presiona **Calcular raíz** para consultar el resultado y la tabla completa.
6. Abre **Ver procedimiento paso a paso** para recorrer cada iteración con su explicación.
7. Consulta **Bisección en otros programas** para copiar el mismo procedimiento en Octave, MATLAB o Python.

Si es tu primera vez, pulsa **¿Cómo usar la aplicación?** en la cabecera para el recorrido guiado.

La tolerancia se compara con el error relativo porcentual `|((cᵢ − cᵢ₋₁) / cᵢ)| × 100`.

## Estructura

```
src/
├── App.tsx                      Estado y composición de las tres áreas
├── components/                  Interfaz (formulario, gráfica, guía, pasos, tabla…)
├── data/sampleFunctions.ts      Catálogo de funciones de prueba
├── types/bisection.ts           Tipos compartidos
└── utils/
    ├── bisection.ts             Algoritmo del método (independiente de la interfaz)
    ├── mathParser.ts            Compilación segura de expresiones
    ├── intervalDetector.ts      Barrido en busca de cambios de signo
    ├── sampler.ts               Muestreo de la curva para graficar
    └── stepNarrative.ts         Descripción textual de cada decisión del método
```

El algoritmo de `utils/bisection.ts` no depende de React ni de la interfaz: recibe una función y los parámetros, y devuelve el resultado con todas las iteraciones.

## Validaciones

La aplicación avisa con un mensaje claro cuando:

- la función no es válida o usa símbolos no permitidos,
- `a >= b`,
- la tolerancia es menor o igual que cero,
- el máximo de iteraciones no es un entero mayor que cero,
- `f(a) · f(b) >= 0` (el intervalo no encierra una raíz),
- la función no produce un valor real y finito en algún punto evaluado.
