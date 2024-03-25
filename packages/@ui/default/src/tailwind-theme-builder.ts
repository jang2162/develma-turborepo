import { config as defaultConfig } from '@config/tailwindcss';
import type { Config } from 'tailwindcss';

import { DesignToken, RefTokenParam, SystemTokenParam } from '@/baseTokens';

export function withTheme<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>>(
    designToken: DesignToken<REF_PARAM, PARAM>,
    overrides: (config: Config) => Config = (config) => config,
): Config {
    const config = {
        ...defaultConfig,
    };
    return overrides(config);
}
