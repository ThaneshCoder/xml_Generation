import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { fileURLToPath } from 'url';
// import viteCompression from 'vite-plugin-compression';
import pkg from './package.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      // viteCompression({
      //   algorithm: 'brotliCompress',
      //   ext: '.br',
      //   threshold: 10240, // Compress assets larger than 10KB
      //   deleteOriginFile: false, // Keep original uncompressed files
      // }),
      // viteCompression({
      //   algorithm: 'gzip',
      //   ext: '.gz',
      //   threshold: 10240,
      //   deleteOriginFile: false,
      // }),
    ],
    server: {
      port: 5090,
      strictPort: true,
    },
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      sourcemap: true,
    },
  };
});
