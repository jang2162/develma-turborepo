import type { Config } from 'tailwindcss';
import * as defaultTheme from 'tailwindcss/defaultTheme';
export const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/@ui/default/src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: ['class', '[data-mode="dark"]'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-pretendard)', ...defaultTheme.fontFamily.sans],
            },
        },
    },
};
