import { tsconfigPaths } from 'vite-resolve-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
export default {
  plugins: [
    tsconfigPaths(),
    viteSingleFile(),
    {
      name: 'remove-type-module',
      transformIndexHtml(html) {
        return html.replace(
          /<script type="module" crossorigin src="(\/assets\/index-[A-Za-z0-9]+\.js)"><\/script>/g,
          '<script type="module" src="$1"></script>',
        );
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: 'public/images',
          dest: 'client/images',
        },
        {
          src: 'public/video',
          dest: 'video',
        },
      ],
    }),
  ],
  esbuild: {
    format: 'esm',
    target: 'es2022',
  },
  server: {
    middlewareMode: false,
    fs: {
      strict: true,
    },
    headers: {
      '.mp4': {
        'Content-Type': 'video/mp4',
      },
      '.m4v': {
        'Content-Type': 'video/mp4',
      },
      '.webm': {
        'Content-Type': 'video/webm',
      },
      '.ogg': {
        'Content-Type': 'video/ogg',
      },
    },
  },
  rollupOptions: {
    output: {
      name: 'window',
      sourcemap: false,
      extend: true,
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        name: 'window',
        sourcemap: false,
        extend: true,
      },
      plugins: [],
    },
  },
};
