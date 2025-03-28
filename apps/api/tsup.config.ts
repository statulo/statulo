import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'statulo-api',
  entry: ['src/main.ts'],
  publicDir: 'src/public',
  format: 'esm',
});
