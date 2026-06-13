import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Degradado a warning (no error): los usos actuales son patrones
      // intencionales que React avala (fetch-on-mount con setLoading, y sync
      // de valores solo-cliente como window.electron o new Date() que no
      // pueden calcularse en render por SSR/hydration). Se mantiene la señal
      // sin bloquear el gate; refactorizarlos es una tarea aparte de DX.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
