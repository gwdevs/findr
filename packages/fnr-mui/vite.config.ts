/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import path from 'path';
import { globSync } from 'glob';
import { join } from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/fnr-mui',

  plugins: [
    dts({
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),
    react(),
    viteTsConfigPaths({
      root: '../../',
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
      entry: 'src/index.ts',
      name: 'fnr-mui',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: false,
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/lab',
        '@mui/icons-material',
        'react-icons',
      ],
      input: globSync(path.resolve(__dirname, 'src/**/*.{ts,tsx}')),
      output: {
        preserveModules: true,
        entryFileNames: (entry) => {
          const { name, facadeModuleId } = entry;
          const fileName = `${name}.js`;
          if (!facadeModuleId) {
            return fileName;
          }
          const relativeDir = path.relative(
            path.resolve(__dirname, 'src'),
            path.dirname(facadeModuleId)
          );
          return path.join(relativeDir, fileName);
        },
      },
    },
  },
});
