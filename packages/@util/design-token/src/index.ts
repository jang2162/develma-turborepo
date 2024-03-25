import type { Config } from 'tailwindcss';

// type RefValue = { value: string | number };
//
// type RefTokens<REF_TOKEN> = Record<
//     Extract<keyof REF_TOKEN, string>,
//     | Extract<keyof REF_TOKEN, string>
//     | RefValue
//     | ((injector: (key: Extract<keyof REF_TOKEN, string>) => RefValue) => RefValue)
// >;
//
// type SystemToken<REF_TOKEN, SYSTEM_TOKEN> = {
//     [key in keyof SYSTEM_TOKEN & Exclude<string, keyof REF_TOKEN>]:
//         | keyof REF_TOKEN
//         | keyof SYSTEM_TOKEN
//         | RefValue
//         | ((injector: (key: keyof REF_TOKEN | keyof SYSTEM_TOKEN) => RefValue) => RefValue);
// };
// function buildRefTokens<REF_TOKEN>(refTokens: RefTokens<REF_TOKEN>): {
//     [key in keyof REF_TOKEN]: RefValue | null;
// } {
//     const ref = { ...refTokens };
//     const result: any = {};
//     for (const key in ref) {
//         result[key] = extractRefValue(key, ref);
//     }
//     return result;
// }
//
// function buildSystemTokens<REF_TOKEN, SYSTEM_TOKEN>(
//     refTokens: {
//         [key in string]: RefValue;
//     },
//     systemToken: SystemToken<REF_TOKEN, SYSTEM_TOKEN>,
// ): {
//     [key in string]: RefValue;
// } {
//     const result = { ...refTokens };
//     for (const key in systemToken) {
//         const value = systemToken[key];
//         if (typeof value === 'function') {
//             //
//         } else if (typeof value === 'string') {
//             //
//         } else if (typeof value === 'object') {
//             result[key] = value;
//         }
//     }
//     return result;
// }

// export type { RefValue, RefTokens, SystemToken };
// export { buildRefTokens, buildSystemTokens };

//////
interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
    [key: string]: V | RecursiveKeyValuePair<K, V>;
}
interface IRefToken {
    colors: {};
}

export function buildTailwindCssConfig(config: Config) {}
export function test(a: number[], ac: string[]) {
    return a.reduce(
        (acc, cur, i) => ({
            ...acc,
            [cur]: ac[i],
        }),
        {} as any,
    );
}
