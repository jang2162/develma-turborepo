import type { Config } from 'tailwindcss';
import * as defaultTheme from 'tailwindcss/defaultTheme';

export const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/@ui/default/src/**/*.{js,ts,jsx,tsx}',
        '!../../packages/@ui/default/src/stories/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-pretendard)', ...defaultTheme.fontFamily.sans],
                'material-symbols-outlined': [
                    'var(--font-material-symbols-outlined)',
                    {
                        fontFeatureSettings: '"liga"',
                    },
                ],
                'material-symbols-rounded': [
                    'var(--font-material-symbols-rounded)',
                    {
                        fontFeatureSettings: '"liga"',
                    },
                ],
                'material-symbols-sharp': [
                    'var(--font-material-symbols-sharp)',
                    {
                        fontFeatureSettings: '"liga"',
                    },
                ],
            },
        },
    },
};
