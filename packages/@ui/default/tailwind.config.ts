import { withTailwindTheme } from '@config/tailwindcss';
import type { Config } from 'tailwindcss';

import { designSystemToken } from './src/tokens/designSystemToken';

export default withTailwindTheme(null, designSystemToken, (config) => ({
    ...config,
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
})) as Config;
