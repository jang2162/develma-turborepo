import { DesignToken, RefTokenParam, SystemTokenParam } from '@util/design-token';
import Color from 'color';
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
export function withTailwindTheme<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    PARAM extends SystemTokenParam<REF_PARAM, PARAM>,
>(
    baseConfig: Config | null,
    designToken: DesignToken<REF_PARAM, PARAM>,
    overrides: (config: Config) => Config = (config) => config,
): Config {
    if (!baseConfig) baseConfig = config;
    if (!baseConfig.theme) baseConfig.theme = {};

    baseConfig.theme.colors = {};
    const { prefix, singleTheme } = designToken.options;
    for (const key in designToken.refToken.dist.colors) {
        const colorKey = `${prefix ? `${prefix}-` : ''}ref-${key}`.replaceAll('.', '-').toLowerCase();
        const c = Color(designToken.refToken.dist.colors[key].value);
        baseConfig.theme.colors[colorKey] = c.hex();
    }

    for (const key in designToken.systemToken.dist.colors) {
        const colorKey = `${prefix ? `${prefix}-` : ''}sys-${key}`.replaceAll('.', '-').toLowerCase();
        const varKey = `${prefix ? `${prefix}-` : ''}sys-color-${key}`.replaceAll('.', '-').toLowerCase();
        if (singleTheme) {
            const c = Color(designToken.systemToken.dist.colors[key].ref.value);
            baseConfig.theme.colors[colorKey] = c.hex();
        } else {
            baseConfig.theme.colors[colorKey] = `rgb(var(--${varKey}) / <alpha-value>)`;
        }
    }
    return overrides(baseConfig);
}
