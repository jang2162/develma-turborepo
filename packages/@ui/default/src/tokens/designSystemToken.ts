import { buildDesignToken } from '@util/design-token';

import { refToken } from './refToken';

export const designSystemToken = buildDesignToken(
    refToken,
    {
        colors: {
            test2: 'studio.200',
            test3: 'studio.700',
        },
        etc: {},
    },
    {
        singleTheme: false,
    },
);
