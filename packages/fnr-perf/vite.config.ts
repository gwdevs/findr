/// <reference types="vitest" />
import { defineConfig } from 'vite';

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
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.js',
      name: 'fnr-perf',
      // fileName: (format, entryName) =>
      //   `${entryName}.${format}`,
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['proskomma-json-tools'],
      output: {
        globals: {
          'proskomma-json-tools': 'proskomma-json-tools',
        },
      },
    },
    sourcemap: false,
  },
});
