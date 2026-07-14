import { defineConfig } from "vite"

import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	build: {
		outDir: "dist",
	},
})

export default config
