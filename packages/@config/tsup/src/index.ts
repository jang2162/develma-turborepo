import { Options } from 'tsup';

export default {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: true,
} as Options;
