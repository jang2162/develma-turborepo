import { buildSubSystemToken } from '@util/design-token';

import { designSystemToken } from '../designSystemToken';

export const mantis = buildSubSystemToken(designSystemToken, {
    colors: {
        test2: 'mantis.200',
        test3: 'mantis.700',
    },
    etc: {},
});
