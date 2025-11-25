import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Mengatur '@' agar mengarah ke folder src (Standard Best Practice)
          '@': path.resolve(__dirname, './src'),
          
          // SOLUSI ERROR: Mendaftarkan alias 'assets' agar import bisa langsung
          // dari 'assets/img/...' tanpa perlu '../'
          'assets': path.resolve(__dirname, './src/assets'),
        }
      }
    };
});