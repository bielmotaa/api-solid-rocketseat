import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths'

// esse arquivo Ela permite que o Vitest entenda os aliases definidos no seu tsconfig.json. os @ de importacao

export default defineConfig({
    plugins: [tsconfigPaths()],
})