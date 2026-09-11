# Laboratorio del Método de Bisección

Aplicación educativa construida con React, TypeScript, Vite, Tailwind CSS, mathjs y Recharts. Permite interpretar una función sin usar `eval()`, graficarla, detectar intervalos con cambio de signo y resolver una raíz exclusivamente mediante el Método de Bisección.

## Características

- **Guías al apuntar con el puntero**: pasa el cursor (o tabula con el teclado) sobre campos, botones, encabezados de la tabla y métricas para ver una tarjeta explicativa con su definición y fórmula.
- **Gráfica interactiva ampliada**: cuadrícula cartesiana completa, guías cruzadas, coordenadas en vivo, vista detallada del intervalo `[a,b]`, vista del rango completo y marcas de extremos y raíz.
- **Detección automática de intervalos** con cambio de signo en `[−10, 10]`.
- **Tabla de iteraciones** con la fila final resaltada y cada columna documentada.
- **Código equivalente** para Octave, MATLAB y Python, generado con la función y los parámetros actuales y listo para copiar.
- **Parser seguro** de expresiones sin `eval()`: valida el AST y limita los símbolos permitidos.

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

1. Escribe una expresión usando `x` como variable (por ejemplo, `exp(-x) + sin(x) - x^2`).
2. Presiona **Graficar y detectar intervalos**.
3. Selecciona un intervalo recomendado o introduce `a` y `b` manualmente.
4. Ajusta la tolerancia porcentual y el máximo de iteraciones.
5. Presiona **Calcular raíz** para consultar el resultado y la tabla completa.
6. Consulta **Bisección en otros programas** para copiar el mismo procedimiento en Octave, MATLAB o Python.

La tolerancia se compara con el error relativo porcentual `|((cᵢ − cᵢ₋₁) / cᵢ)| × 100`.
