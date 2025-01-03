import { glob } from 'glob';

export default {
  esbuild: {
    format: 'esm',
    target: 'es2022',
  },
  build: {
    ssr: true,
    minify: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: await glob(['src/client/app/view/**/index.ts']),
      output: {
        name: 'window',
        format: 'esm',
        sourcemap: false,
        extend: true,
      },
      plugins: [],
    },
  },
};
