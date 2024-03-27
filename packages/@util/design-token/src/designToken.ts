import Color from 'color';

type RefValue<T> = { value: T };

type RefValueEtc = RefValue<string>;

type RefValueColor = RefValue<[number, number, number]>;

type RefVariable<VAL, REF_VARS> = Record<string, VAL | keyof REF_VARS>;
type SystemVariable<VAL, REF_VARS, SYS_VARS> = Record<string, keyof REF_VARS | keyof SYS_VARS | VAL>;

type SubSystemVariable<VAL, REF_VARS, SYS_VARS> = Record<
    Partial<keyof SYS_VARS>,
    keyof REF_VARS | keyof SYS_VARS | VAL
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
    param: PARAM;
    dist: RefTokenDist<PARAM>;
};

type SystemTokenParam<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    colors: SystemVariable<RefValueColor, REF_PARAM['colors'], PARAM['colors']>;
    etc: SystemVariable<RefValueEtc, REF_PARAM['etc'], PARAM['etc']>;
};
type SystemTokenDist<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    colors: Record<keyof PARAM['colors'], { ref: RefValueColor; isSystem: boolean }>;
    etc: Record<keyof PARAM['etc'], { ref: RefValueEtc; isSystem: boolean }>;
};

type SystemTokenResult<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>> = {
    param: PARAM;
    dist: SystemTokenDist<REF_PARAM, PARAM>;
};

type SubSystemTokenParam<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    PARAM extends SystemTokenParam<REF_PARAM, PARAM>,
> = {
    colors: SubSystemVariable<RefValueColor, REF_PARAM['colors'], PARAM['colors']>;
    etc: SubSystemVariable<RefValueEtc, REF_PARAM['etc'], PARAM['etc']>;
};

type SubSystemTokenResult<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    SYS_PARAM extends SystemTokenParam<REF_PARAM, SYS_PARAM>,
> = {
    param: SubSystemTokenParam<REF_PARAM, SYS_PARAM>;
    designToken: DesignToken<REF_PARAM, SYS_PARAM>;
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
    cache: { [key in string]: { ref: T; isSystem: boolean } },
    refStack: string[] = [],
): { ref: T; isSystem: boolean } {
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
        return { ref: sysValue, isSystem: true };
    } else if (key in refVars) {
        return { ref: refVars[key], isSystem: false };
    }
    throw new Error(`Cannot found token value. (${debugStr}: ${key})`);
}

function buildRefTokens<PARAM extends RefTokenParam<PARAM>>(refTokens: PARAM): RefTokenResult<PARAM> {
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

function buildDesignToken<REF_PARAM extends RefTokenParam<REF_PARAM>, PARAM extends SystemTokenParam<REF_PARAM, PARAM>>(
    refToken: RefTokenResult<REF_PARAM>,
    systemTokens: PARAM | ((dist: RefTokenDist<REF_PARAM>) => PARAM),
    options: DesignToken<REF_PARAM, PARAM>['options'] = {
        prefix: '',
        checkDuplicate: true,
        singleTheme: true,
    },
): DesignToken<REF_PARAM, PARAM> {
    const { prefix = '', checkDuplicate = true, singleTheme = true } = options;

    const dist = {
        colors: {},
        etc: {},
    } as any;

    const colorCache: { [key in string]: { ref: RefValueColor; isSystem: boolean } } = {};

    const sysToken: PARAM = typeof systemTokens === 'function' ? systemTokens(refToken.dist) : systemTokens;
    for (const i in sysToken.colors) {
        const val = sysToken.colors[i];
        if (typeof val === 'string') {
            dist.colors[i] = extractSystemValue('sysColor', val, refToken.dist.colors, sysToken.colors, colorCache);
        } else {
            dist.colors[i] = { ref: val, isSystem: true };
        }
    }

    const etcCache: { [key in string]: { ref: RefValueEtc; isSystem: boolean } } = {};
    for (const i in sysToken.etc) {
        const val = sysToken.etc[i];
        if (typeof val === 'string') {
            dist.etc[i] = extractSystemValue('sysEtc', val, refToken.dist.etc, sysToken.etc, etcCache);
        } else {
            dist.etc[i] = { ref: val, isSystem: true };
        }
    }

    return {
        refToken,
        systemToken: {
            dist: dist as SystemTokenDist<REF_PARAM, PARAM>,
            param: sysToken,
        },
        options: {
            prefix,
            checkDuplicate,
            singleTheme,
        },
    };
}

function buildSubSystemToken<
    REF_PARAM extends RefTokenParam<REF_PARAM>,
    SYS_PARAM extends SystemTokenParam<REF_PARAM, SYS_PARAM>,
>(
    designToken: DesignToken<REF_PARAM, SYS_PARAM>,
    subSystemTokens: SubSystemTokenParam<REF_PARAM, SYS_PARAM>,
): SubSystemTokenResult<REF_PARAM, SYS_PARAM> {
    if (designToken.options.singleTheme) {
        throw new Error('Single theme is not supported');
    }
    const dist = {
        colors: {},
        etc: {},
    } as any;

    for (const i in subSystemTokens.colors) {
        dist.colors[i] = { isSystem: i in designToken.systemToken.param.colors };
    }

    for (const i in subSystemTokens.etc) {
        dist.etc[i] = { isSystem: i in designToken.systemToken.param.etc };
    }
    return {
        param: subSystemTokens,
        designToken,
    };
}
type RecursiveKeyValuePair<V = string> = {
    [key: string]: V | RecursiveKeyValuePair<V>;
};

function colorVal(color: string): RefValueColor {
    const c = Color(color);
    return { value: [c.red(), c.green(), c.blue()] };
}

function etcVal(val: string): RefValueEtc {
    return { value: val };
}

function flatColors(colors: RecursiveKeyValuePair, prefixStack: string[] = []) {
    let flatMap: Record<string, RefValueColor> = {};
    for (const k in colors) {
        const val = colors[k];
        if (typeof val === 'object') {
            flatMap = {
                ...flatMap,
                ...flatColors(val, [...prefixStack, k]),
            };
        } else {
            flatMap[[...prefixStack, k].join('.')] = colorVal(val);
        }
    }
    return flatMap;
}

function flatEtcVals(colors: RecursiveKeyValuePair, prefixStack: string[] = []) {
    let flatMap: Record<string, RefValueEtc> = {};
    for (const k in colors) {
        const val = colors[k];
        if (typeof val === 'object') {
            flatMap = {
                ...flatMap,
                ...flatEtcVals(val, [...prefixStack, k]),
            };
        } else {
            flatMap[[...prefixStack, k].join('.')] = etcVal(val);
        }
    }
    return flatMap;
}

export type {
    RefValue,
    RefValueEtc,
    RefValueColor,
    RefTokenParam,
    SystemTokenParam,
    SubSystemTokenParam,
    SubSystemTokenResult,
    DesignToken,
};

export { buildRefTokens, buildDesignToken, buildSubSystemToken, colorVal, etcVal, flatColors, flatEtcVals };
