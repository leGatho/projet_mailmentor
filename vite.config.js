import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy pour les appels à l'API Mistral
      '/api/mistral': {
        target: 'https://api.mistral.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mistral/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Ajouter la clé API à toutes les requêtes
            proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_LAPLATEFORME_API_KEY || import.meta.env.VITE_LAPLATEFORME_API_KEY}`);
          });
        },
      },
    },
  },
})
