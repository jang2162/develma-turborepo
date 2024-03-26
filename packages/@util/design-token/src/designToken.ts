type RefValue<T> = { value: T };

type RefValueEtc = RefValue<string>;

type RefValueColor = RefValue<[number, number, number]>;

type RefVariable<VAL, REF_VARS> = Record<string, VAL | keyof REF_VARS>;

type SystemVariable<VAL, REF_VARS, SYS_VARS> = Record<string, keyof REF_VARS | keyof SYS_VARS | VAL>;
type SubSystemVariable<VAL, REF_VARS, SYS_VARS> = Partial<
    Record<keyof SYS_VARS, keyof REF_VARS | keyof SYS_VARS | VAL>
>;

type RefTokenParam<PARAM extends RefTokenParam<PARAM>> = {
    colors: RefVariable<RefValueColor, PARAM['colors']>;
    etc: RefVariable<RefValueEtc, PARAM['etc']>;
};

type RefTokenDist<PARAM extends RefTokenParam<PARAM>> = {
    colors: Record<keyof PARAM['colors'], RefValueColor>;
    etc: Record<keyof PARAM['etc'], RefValueEtc>;
};

type RefTokenResult<PARAM extends RefTokenParam<PARAM>> = {
    param: RefTokenParam<PARAM>;
    dist: RefTokenDist<PARAM>;
};

type SystemTokenParam<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    colors: SystemVariable<RefValueColor, REF_PARAM['colors'], PARAM['colors']>;
    etc: SystemVariable<RefValueEtc, REF_PARAM['etc'], PARAM['etc']>;
};

type SystemTokenDist<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    colors: Record<keyof PARAM['colors'], RefValueColor>;
    etc: Record<keyof PARAM['etc'], RefValueEtc>;
};

type SystemTokenResult<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    param: SystemTokenParam<REF_PARAM, PARAM>;
    dist: SystemTokenDist<REF_PARAM, PARAM>;
};

type SubSystemTokenParam<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    PARAM extends SystemTokenParam<REF_PARAM, PARAM>,
> = {
    colors: SubSystemVariable<RefValueColor, REF_PARAM['colors'], PARAM['colors']>;
    etc: SubSystemVariable<RefValueEtc, REF_PARAM['etc'], PARAM['etc']>;
};

type DesignToken<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    refToken: RefTokenResult<REF_PARAM>;
    systemToken: SystemTokenResult<REF_PARAM, PARAM>;
    options: {
        prefix?: string;
        singleTheme?: boolean;
        checkDuplicate?: boolean;
    };
};

function extractRefValue<T, VARS extends RefVariable<T, VARS>>(
    debugStr: string,
    key: string,
    vars: VARS,
    cache: { [key in string]: T },
    refStack: string[] = [],
): T {
    const value = vars[key];
    if (typeof value === 'string') {
        if (value in cache) {
            return cache[value];
        }
        if (refStack.indexOf(value) >= 0) {
            throw new Error(`Circular reference detected: ${debugStr} -> ${refStack.join(' -> ')} -> ${value}`);
        }
        return (cache[key] = extractRefValue<T, VARS>(debugStr, value, vars, cache, [...refStack, key]));
    } else if (typeof value === 'object') {
        return value;
    }
    throw new Error(`Cannot found token value. (${debugStr}: ${key})`);
}

function extractSystemValue<
    T,
    REF_VARS extends Record<string, T>,
    SYS_VARS extends SystemVariable<T, REF_VARS, SYS_VARS>,
>(
    debugStr: string,
    key: string,
    refVars: REF_VARS,
    sysRefVars: SYS_VARS,
    cache: { [key in string]: T },
    refStack: string[] = [],
): T {
    const sysValue = sysRefVars[key];
    if (typeof sysValue === 'string') {
        if (sysValue in cache) {
            return cache[sysValue];
        }
        if (refStack.indexOf(sysValue) >= 0) {
            throw new Error(`Circular reference detected: ${debugStr} -> ${refStack.join(' -> ')} -> ${sysValue}`);
        }
        return (cache[key] = extractSystemValue<T, REF_VARS, SYS_VARS>(debugStr, sysValue, refVars, sysRefVars, cache, [
            ...refStack,
            key,
        ]));
    } else if (typeof sysValue === 'object') {
        return sysValue;
    } else if (key in refVars) {
        return refVars[key];
    }
    throw new Error(`Cannot found token value. (${debugStr}: ${key})`);
}

export function buildRefTokens<PARAM extends RefTokenParam<PARAM>>(refTokens: PARAM): RefTokenResult<PARAM> {
    const dist = {
        colors: {
            ...refTokens.colors,
        },
        etc: {
            ...refTokens.etc,
        },
    };

    const colorCache: { [key in string]: RefValueColor } = {};
    for (const i in dist.colors) {
        const val = dist.colors[i];
        if (typeof val === 'string') {
            dist.colors[i] = extractRefValue('refColor', val, refTokens.colors, colorCache);
        }
    }

    const etcCache: { [key in string]: RefValueEtc } = {};
    for (const i in dist.etc) {
        const val = dist.etc[i];
        if (typeof val === 'string') {
            dist.etc[i] = extractRefValue('refEtc', val, refTokens.etc, etcCache);
        }
    }

    return {
        dist: dist as RefTokenDist<PARAM>,
        param: refTokens,
    };
}

export function buildDesignToken<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    PARAM extends SystemTokenParam<REF_PARAM, PARAM>,
>(
    refToken: RefTokenResult<REF_PARAM>,
    systemTokens: PARAM,
    options: DesignToken<REF_PARAM, PARAM>['options'] = {
        prefix: '',
        checkDuplicate: true,
        singleTheme: true,
    },
): DesignToken<REF_PARAM, PARAM> {
    const { prefix = '', checkDuplicate = true, singleTheme = true } = options;

    const dist = {
        colors: {
            ...systemTokens.colors,
        },
        etc: {
            ...systemTokens.etc,
        },
    };

    const colorCache: { [key in string]: RefValueColor } = {};
    for (const i in dist.colors) {
        const val = dist.colors[i];
        if (typeof val === 'string') {
            dist.colors[i] = extractSystemValue('sysColor', val, refToken.dist.colors, systemTokens.colors, colorCache);
        }
    }

    const etcCache: { [key in string]: RefValueEtc } = {};
    for (const i in dist.etc) {
        const val = dist.etc[i];
        if (typeof val === 'string') {
            dist.etc[i] = extractSystemValue('sysEtc', val, refToken.dist.etc, systemTokens.etc, etcCache);
        }
    }

    return {
        refToken,
        systemToken: {
            dist: dist as SystemTokenDist<REF_PARAM, PARAM>,
            param: systemTokens,
        },
        options: {
            prefix,
            checkDuplicate,
            singleTheme,
        },
    };
}

export function buildSubSystemToken<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    SYS_PARAM extends SystemTokenParam<REF_PARAM, SYS_PARAM>,
    PARAM extends SubSystemTokenParam<REF_PARAM, SYS_PARAM>,
>(designToken: DesignToken<REF_PARAM, SYS_PARAM>, subSystemTokens: PARAM): PARAM {
    if (designToken.options.singleTheme) {
        throw new Error('Single theme is not supported');
    }

    return subSystemTokens;
}

export type {
    RefValue,
    RefValueEtc,
    RefValueColor,
    RefVariable,
    SystemVariable,
    SystemTokenParam,
    SystemTokenDist,
    SystemTokenResult,
    SubSystemTokenParam,
    RefTokenParam,
    RefTokenDist,
    RefTokenResult,
    DesignToken,
};
