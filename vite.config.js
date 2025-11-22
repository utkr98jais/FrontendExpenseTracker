import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// If deploying to GitHub Pages at https://<username>.github.io/FrontendExpenseTracker/
// set the base to '/FrontendExpenseTracker/'. If you later move to a root custom domain,
// you can remove this.
export default defineConfig({
  base: '/FrontendExpenseTracker/',
  plugins: [react(), tailwindcss()],
})
