// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'], 
  outDir: 'build',
  target: 'es2020',
  format: ['esm'],
  sourcemap: true,
  clean: true,
  dts: false,
});
