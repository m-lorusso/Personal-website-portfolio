import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The interactive 3D/physics scenes deliberately read and write refs from
    // requestAnimationFrame loops to keep animation off the React render path
    // (documented in each file). Exempt them from the ref/immutability rules
    // rather than rewriting working scene internals.
    files: [
      "components/watch/ProceduralWatchModel.tsx",
      "components/project-detail/watch-build.tsx",
      "components/project-detail/pc-cooling-scene.tsx",
      "components/project-detail/rubiks-physical-cube.tsx",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
