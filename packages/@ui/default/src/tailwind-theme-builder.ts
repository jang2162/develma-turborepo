import { config as defaultConfig } from '@config/tailwindcss';
import type { Config } from 'tailwindcss';

const aa = {
    40: '#f00',
};

const a = [40, 50, 60];
const ac = ['#f00', '#0f0', '#00f'];

export const c = {
    addds: {
        50: '#eef2ff',
        51: '#eef2ff',
        52: '#eef2ff',
        53: '#eef2ff',
        100: 'rgb(var(--color-primary) / <alpha-value>)',
    },
};

export const tailWIndCssConfig = {
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        colors: c,
    },
} satisfies Config;

export function withTheme(overrides: (config: Config) => Config = (config) => config): Config {
    const config = {
        ...defaultConfig,
    };
    return overrides(config);
}
