import {blue} from 'tailwindcss/colors';
type RefValue = { value: string | number };
type RefColor = { value: [number, number, number] };

type RefColorVariable<REF_TOKEN> = Record<string, RefValue>;

type RefColorTokens<
    REF_TOKEN extends Record<string, RefValue | REF_TOKEN_KEYS>,
    REF_TOKEN_KEYS extends keyof REF_TOKEN,
> = {
    variable: REF_TOKEN;
    computed: Record<Exclude<string, keyof REF_TOKEN>, any>;
};

type RefTokenInjectorFn<REF_TOKEN_KEYS> = (key: REF_TOKEN_KEYS) => RefValue;
// type SystemToken<REF_TOKEN, SYSTEM_TOKEN> = Record<
//     Exclude<string, keyof REF_TOKEN>,
//     keyof REF_TOKEN | keyof SYSTEM_TOKEN | RefType
// >;

function buildRefTokens<REF_TOKEN extends RefTokens<REF_TOKEN>>(refTokens: REF_TOKEN): void {
    console.log(refTokens);
}
// function buildSystemTokens<REF_TOKEN, SYSTEM_TOKEN>(
//     refTokens: RefTokens<REF_TOKEN>,
//     systemToken: SystemToken<REF_TOKEN, SYSTEM_TOKEN>,
// ): SystemToken<REF_TOKEN, SYSTEM_TOKEN> {
//     return systemToken;
// }

// export type {RefType, RefTokens, SystemToken };
// export { buildRefTokens, buildSystemTokens };

buildRefTokens({
    a: { value: 123 },
    aa: { value: 123 },
    aaa: { value: 123 },
    aaaa: 'aaa',
    aa1aa: 'aaa',
    aa2aa: '',
    aaa4a: 'aaa',
});


function test<T>(a: T extends RefColorVariable<T>) {
    console.log(a);
}
