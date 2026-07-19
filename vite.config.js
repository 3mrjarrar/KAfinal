import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/KAfinal/',

    plugins: [react()],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://knowledgeshop.runasp.net/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})