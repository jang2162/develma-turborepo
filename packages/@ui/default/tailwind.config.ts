import { withTailwindTheme } from '@config/tailwindcss';
import type { Config } from 'tailwindcss';

import { designToken } from './src/designToken';

export default withTailwindTheme(null, designToken, (config) => ({
    ...config,
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
})) as Config;
