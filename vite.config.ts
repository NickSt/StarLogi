
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs/promises';

// Custom plugin to minify JSON files after build
const minifyJson = () => ({
  name: 'minify-json',
  closeBundle: async () => {
    const distDir = path.resolve(__dirname, 'dist');
    const processDir = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await processDir(fullPath);
        } else if (entry.name.endsWith('.json')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          try {
            const minified = JSON.stringify(JSON.parse(content));
            await fs.writeFile(fullPath, minified);
            console.log(`Minified: ${fullPath}`);
          } catch (e) {
            console.error(`Failed to minify ${fullPath}:`, e);
          }
        }
      }
    };
    await processDir(distDir);
  },
});

export default defineConfig({
  plugins: [react(), minifyJson()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  base: './',
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'viz-lib': ['recharts'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
});
