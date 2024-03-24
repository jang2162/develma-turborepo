import type { Config } from 'tailwindcss';

import { withTheme } from './src/tailwind-theme-builder';

export default withTheme((config) => ({
    ...config,
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
})) as Config;
