import { viteStaticCopy } from 'vite-plugin-static-copy';

export default {
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
  plugins: [
    {
      name: 'remove-type-module',
      transformIndexHtml(html) {
        return html.replace(
          /<script type="module" crossorigin src="(\/assets\/index-[A-Za-z0-9]+\.js)"><\/script>/g,
          '<script src="$1"></script>',
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
  build: {
    minify: false,
    manifest: 'manifest-index.json',
    rollupOptions: {
      output: {
        format: 'esm',
        sourcemap: false,
        extend: true,
      },
    },
  },
};
