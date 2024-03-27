import Color from 'color';
import { createContext, Dispatch, ReactNode, useContext, useMemo, useState } from 'react';
import { DesignToken, SubSystemTokenParam, SubSystemTokenResult } from './designToken';

const DesignTokenContext = createContext<DesignToken<any, any> | null>(null);
const TopSubSystemTokenDispatchContext = createContext<Dispatch<SubSystemTokenParam<any, any> | any>>(() => null);
const SubSystemTokenDispatchContext = createContext<Dispatch<SubSystemTokenParam<any, any> | any>>(() => null);

export const useTopSubSystemTokenDispatch = () => {
    const dispatch = useContext(TopSubSystemTokenDispatchContext);
    return dispatch;
};

export const useSubSystemTokenDispatch = () => {
    const dispatch = useContext(SubSystemTokenDispatchContext);
    return dispatch;
};

export const useCssVariableFromSubSystemToken = (subDesignToken: SubSystemTokenResult<any, any> | null) => {
    const variables = useMemo(() => {
        if (subDesignToken == null) {
            return null;
        }
        const designToken = subDesignToken.designToken;
        const { prefix, singleTheme, checkDuplicate } = designToken.options;
        const memo: Record<string, string> = {};
        for (const key in subDesignToken.param.colors) {
            const varKey = `${prefix ? `${prefix}-` : ''}sys-color-${key}`.replaceAll('.', '-').toLowerCase();
            const paramVal = subDesignToken.param.colors[key];
            if (typeof paramVal === 'string') {
                console.log(designToken.systemToken.param.colors);
                const varRefKey = `${prefix ? `${prefix}-` : ''}${
                    paramVal in designToken.systemToken.param.colors ? 'sys' : 'ref'
                }-color-${paramVal}`
                    .replaceAll('.', '-')
                    .toLowerCase();
                memo[varKey] = `var(--${varRefKey})`;
            } else if (typeof paramVal === 'object') {
                const c = Color(paramVal.value);
                memo[varKey] = `${c.red()} ${c.green()} ${c.blue()}`;
            } else {
                throw new Error(`Invalid type: ${key}`);
            }
        }

        for (const key in subDesignToken.param.etc) {
            const varKey = `${prefix ? `${prefix}-` : ''}sys-etc-${key}`.replaceAll('.', '-').toLowerCase();
            if (checkDuplicate && memo[varKey]) {
                throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
            }
            const paramVal = subDesignToken.param.etc[key];

            if (typeof paramVal === 'string') {
                const varRefKey = `${prefix ? `${prefix}-` : ''}${
                    paramVal in designToken.systemToken.param.etc ? 'sys' : 'ref'
                }-etc-${paramVal}`
                    .replaceAll('.', '-')
                    .toLowerCase();
                memo[varKey] = `var(--${varRefKey})`;
            } else if (typeof paramVal === 'object') {
                memo[varKey] = paramVal.value;
            } else {
                throw new Error(`Invalid type: ${key}`);
            }
        }
        return memo;
    }, [subDesignToken]);
    return variables;
};

export const DesignTokenProvider = ({
    designToken,
    children,
}: {
    children?: ReactNode;
    designToken: DesignToken<any, any>;
}) => {
    const p = useContext(DesignTokenContext);
    const { prefix, singleTheme, checkDuplicate } = designToken.options;
    if (p) {
        throw new Error('DesignTokenProvider is already defined');
    }
    const [subDesignToken, setSubDesignToken] = useState<SubSystemTokenResult<any, any> | null>(null);
    if (subDesignToken && singleTheme) {
        throw new Error('Single theme is not supported');
    }

    if (singleTheme) {
        return <>{children}</>;
    }
    const variables = useMemo(() => {
        const memo: Record<string, string> = {};
        for (const key in designToken.refToken.dist.colors) {
            const varKey = `${prefix ? `${prefix}-` : ''}ref-color-${key}`.replaceAll('.', '-').toLowerCase();
            if (checkDuplicate && memo[varKey]) {
                throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
            }
            const c = Color(designToken.refToken.dist.colors[key].value);
            memo[varKey] = `${c.red()} ${c.green()} ${c.blue()}`;
        }

        for (const key in designToken.systemToken.param.colors) {
            const varKey = `${prefix ? `${prefix}-` : ''}sys-color-${key}`.replaceAll('.', '-').toLowerCase();
            if (checkDuplicate && memo[varKey]) {
                throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
            }
            const paramVal = designToken.systemToken.param.colors[key];
            const distVal = designToken.systemToken.dist.colors[key];
            if (typeof paramVal === 'string') {
                const varRefKey = `${prefix ? `${prefix}-` : ''}${distVal.isSystem ? 'sys' : 'ref'}-color-${paramVal}`
                    .replaceAll('.', '-')
                    .toLowerCase();
                memo[varKey] = `var(--${varRefKey})`;
            } else {
                const c = Color(paramVal.value);
                memo[varKey] = `${c.red()} ${c.green()} ${c.blue()}`;
            }
        }

        for (const key in designToken.refToken.dist.etc) {
            const varKey = `${prefix ? `${prefix}-` : ''}ref-etc-${key}`.replaceAll('.', '-').toLowerCase();
            if (checkDuplicate && memo[varKey]) {
                throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
            }
            memo[varKey] = designToken.refToken.dist.etc[key].value;
        }

        for (const key in designToken.systemToken.param.etc) {
            const varKey = `${prefix ? `${prefix}-` : ''}sys-etc-${key}`.replaceAll('.', '-').toLowerCase();
            if (checkDuplicate && memo[varKey]) {
                throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
            }
            const paramVal = designToken.systemToken.param.etc[key];
            const distVal = designToken.systemToken.dist.etc[key];
            if (typeof paramVal === 'string') {
                const varRefKey = `${prefix ? `${prefix}-` : ''}${distVal.isSystem ? 'sys' : 'ref'}-etc-${paramVal}`
                    .replaceAll('.', '-')
                    .toLowerCase();
                memo[varKey] = `var(--${varRefKey})`;
            } else {
                memo[varKey] = paramVal.value;
            }
        }
        return memo;
    }, []);

    const subVariables = useCssVariableFromSubSystemToken(subDesignToken);

    return (
        <DesignTokenContext.Provider value={designToken}>
            <TopSubSystemTokenDispatchContext.Provider value={setSubDesignToken}>
                <CssVariableProvider
                    variables={{
                        ...variables,
                        ...subVariables,
                    }}
                >
                    {children}
                </CssVariableProvider>
            </TopSubSystemTokenDispatchContext.Provider>
        </DesignTokenContext.Provider>
    );
};

export const SubDesignTokenProvider = ({
    subSystemToken = null,
    children,
}: {
    children?: ReactNode;
    subSystemToken?: SubSystemTokenResult<any, any> | null;
}) => {
    const [subDesignToken, setSubDesignToken] = useState(subSystemToken);
    const designToken = useContext(DesignTokenContext);
    if (!designToken) {
        throw new Error('DesignTokenProvider is not defined');
    }
    if (subSystemToken && subSystemToken.designToken !== designToken) {
        throw new Error('DesignTokenProvider is not matched');
    }
    if (designToken.options.singleTheme) {
        throw new Error('Single theme is not supported');
    }
    console.log(subDesignToken);
    const variables = useCssVariableFromSubSystemToken(subDesignToken);
    return (
        <SubSystemTokenDispatchContext.Provider value={setSubDesignToken}>
            <CssVariableProvider variables={variables}>{children}</CssVariableProvider>
        </SubSystemTokenDispatchContext.Provider>
    );
};

export const CssVariableProvider = ({
    variables,
    children,
}: {
    children?: ReactNode;
    variables: Record<string, string> | null;
}) => {
    if (variables == null || Object.keys(variables).length === 0) {
        return <>{children}</>;
    }

    const style: Record<string, string> = {};
    for (const key in variables) {
        style[`--${key}`] = variables[key];
    }
    return <div style={style}>{children}</div>;
};
