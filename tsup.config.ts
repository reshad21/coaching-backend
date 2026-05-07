// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'build',
  target: 'es2020',
  format: ['cjs'], // Use CommonJS for Vercel Node
  sourcemap: true,
  clean: true,
  dts: false,
});
