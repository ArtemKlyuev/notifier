import fs from 'node:fs/promises';
import path from 'node:path';

import { build, BuildOptions } from 'esbuild';
import { dTSPathAliasPlugin } from 'esbuild-plugin-d-ts-path-alias';

const DIST_DIR = 'dist';

const baseOptions: BuildOptions = {
  target: 'es2019',
  entryPoints: ['./src/index.ts'],
  bundle: true,
  treeShaking: true,
  sourcemap: false,
  minify: false,
};

const start = async (): Promise<void> => {
  await fs.rm(DIST_DIR, { force: true, recursive: true });

  build({
    ...baseOptions,
    splitting: true,
    format: 'esm',
    outdir: `${DIST_DIR}/esm`,
    plugins: [dTSPathAliasPlugin({ outputPath: `${DIST_DIR}/typings`, debug: true })],
  });

  await build({
    ...baseOptions,
    format: 'cjs',
    outfile: `${DIST_DIR}/cjs/notifier-effector.development.js`,
  });

  await build({
    ...baseOptions,
    format: 'cjs',
    minify: true,
    outfile: `${DIST_DIR}/cjs/notifier-effector.production.min.js`,
  });

  await fs.copyFile(
    path.resolve(__dirname, './index-cjs.build.js'),
    path.resolve(process.cwd(), `${DIST_DIR}/cjs/index.js`),
  );
};

start();
