import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`, // Import your Sass variables if needed
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // Make sure this points to the correct root directory of your project
        },
    },
})
