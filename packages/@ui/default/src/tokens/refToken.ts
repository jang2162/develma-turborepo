import { buildRefTokens, colorVal } from '@util/design-token';

export const refToken = buildRefTokens({
    colors: {
        'studio.50': colorVal('#f6f5fd'),
        'studio.100': colorVal('#efecfb'),
        'studio.200': colorVal('#e2dbf9'),
        'studio.300': colorVal('#cbbff3'),
        'studio.400': colorVal('#b19aeb'),
        'studio.500': colorVal('#9671e1'),
        'studio.600': colorVal('#8652d5'),
        'studio.700': colorVal('#7d4ac4'),
        'studio.800': colorVal('#6335a2'),
        'studio.900': colorVal('#522d85'),
        'studio.950': colorVal('#331c59'),

        'mantis.50': colorVal('#f3fbf2'),
        'mantis.100': colorVal('#e2f8e0'),
        'mantis.200': colorVal('#c7efc3'),
        'mantis.300': colorVal('#99e194'),
        'mantis.400': colorVal('#52c44a'),
        'mantis.500': colorVal('#3faf38'),
        'mantis.600': colorVal('#2f9029'),
        'mantis.700': colorVal('#277223'),
        'mantis.800': colorVal('#225b20'),
        'mantis.900': colorVal('#1d4b1c'),
        'mantis.950': colorVal('#0a290a'),
        'mantis.aaa': 'mantis.950',
    },
    etc: {
        b1: { value: '50px' },
        b2: 'b1',
        a2: 'b1',
    },
});
