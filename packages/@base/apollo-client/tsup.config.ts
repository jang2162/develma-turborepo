import options from '@config/tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
    ...options,
    entry: {
        index: 'src/index.ts',
        'browser/index': 'src/browser/index.ts',
        'server/index': 'src/server/index.ts',
    },
});
