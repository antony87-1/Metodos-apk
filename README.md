# Laboratorio del Método de Bisección

Aplicación educativa construida con React, TypeScript, Vite, Tailwind CSS, mathjs y Recharts. Permite interpretar una función sin usar `eval()`, graficarla, detectar intervalos con cambio de signo y resolver una raíz exclusivamente mediante el Método de Bisección.

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

La tolerancia se compara con el error relativo porcentual `|((cᵢ − cᵢ₋₁) / cᵢ)| × 100`.
