/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'node:path';

import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { join } from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/fnr-text',

  plugins: [
    dts({
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),

    viteTsConfigPaths({
      root: '../../',
    }),

    viteStaticCopy({
      targets: [
        {
          src: './README.md',
          dest: '.',
        },
      ],
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: {
        fnr: path.resolve(__dirname, 'src/lib/index.ts'),
        multiline: path.resolve(__dirname, 'src/lib/multiline/index.ts'),
      },
      name: 'fnr-text',
      fileName: (format, entryName) => `@findr/text/${entryName}.${format}.js`,
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['xregexp'],
      output: {
        globals: {
          xregexp: 'xre',
        },
      },
    },
    sourcemap: true,
  },
});
