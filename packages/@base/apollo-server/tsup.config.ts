import options from '@config/tsup';
import { defineConfig } from 'tsup';

export default defineConfig({
    ...options,
    entry: {
        index: 'src/index.ts',
        'services/index': 'src/services/index.ts',
    },
});
