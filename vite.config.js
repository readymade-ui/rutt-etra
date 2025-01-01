import { viteStaticCopy } from 'vite-plugin-static-copy';
export default {
  resolve: {
    alias: {
      'three': 'node_modules/three',
    },
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
    viteStaticCopy({
      targets: [
        {
          src: 'public/images',
          dest: 'images',
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
  rollupOptions: {
    output: {
      name: 'window',
      sourcemap: false,
      extend: true,
    },
  },
};
