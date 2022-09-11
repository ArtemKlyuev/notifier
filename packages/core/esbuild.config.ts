import fs from 'node:fs/promises';

import { build, BuildOptions } from 'esbuild';
import { dTSPathAliasPlugin } from 'esbuild-plugin-d-ts-path-alias';

import { devDependencies } from './package.json';

const DIST_DIR = 'dist';
const EXTERNAL_PACKAGES = Object.keys(devDependencies);

const baseOptions: BuildOptions = {
  target: 'es2019',
  external: EXTERNAL_PACKAGES,
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

  build({
    ...baseOptions,
    format: 'cjs',
    outdir: `${DIST_DIR}/cjs`,
  });
};

start();
