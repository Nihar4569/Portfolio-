import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import { handleCrew } from './api/crew.js';

const emailSettings = ['SERVICE_ID', 'TEMPLATE_ID', 'PUBLIC_KEY'];

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const crewMiddleware = (server) => {
    server.middlewares.use('/api/crew', (request, response) => handleCrew(request, response, env));
  };

  return {
    plugins: [
      {
        name: 'legacy-react-js',
        enforce: 'pre',
        transform(code, id) {
          if (/\/src\/.*\.js$/.test(id)) {
            return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
          }
        },
      },
      react(),
      {
        name: 'local-crew-api',
        configureServer: crewMiddleware,
        configurePreviewServer: crewMiddleware,
      },
    ],
    // Preserve the live contact form's explicitly public EmailJS settings.
    define: Object.fromEntries(emailSettings.map((setting) => {
      const key = `REACT_APP_EMAILJS_${setting}`;
      return [`process.env.${key}`, JSON.stringify(env[key] ?? '')];
    })),
    optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
    server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
    build: { outDir: 'dist/client' },
  };
});
