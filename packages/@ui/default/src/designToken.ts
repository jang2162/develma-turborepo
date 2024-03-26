import { buildDesignToken, buildRefTokens } from '@util/design-token';

const refToken = buildRefTokens({
    colors: {
        a1: 'a2',
        a2: { value: [255, 2, 3] },
        a3: { value: [255, 2, 3] },
        a4: { value: [1, 255, 3] },
        a5: { value: [1, 2, 255] },
        test: { value: [1, 2, 255] },
    },
    etc: {
        b1: { value: 123 },
        b2: 'b1',
        a2: 'b2',
    },
});

export const designToken = buildDesignToken(
    refToken,
    {
        colors: {
            test2: 'a3',
            test3: 'test2',
        },
        etc: {},
    },
    {
        singleTheme: false,
    },
);

//
// export const subSystemToken = buildSubSystemToken(designToken.ts, {
//     colors: {
//         test2: 'a3',
//     },
//     etc: {},
// });
