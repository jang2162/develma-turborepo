import Color from 'color';
import { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from 'react';
import { DesignToken, RefTokenParam, SystemTokenParam } from '../dist/index';
import { SubSystemTokenParam } from './designToken';

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
    const [subDesignToken, setSubDesignToken] = useState(null);
    if (subDesignToken && singleTheme) {
        throw new Error('Single theme is not supported');
    }

    if (singleTheme) {
        return <>{children}</>;
    }
    const variables: Record<string, string> = {};

    for (const key in designToken.refToken.dist.colors) {
        const varKey = `${prefix ? `${prefix}-` : ''}ref-color-${key}`.replaceAll('.', '-').toLowerCase();
        if (checkDuplicate && variables[varKey]) {
            throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
        }
        const c = Color(designToken.refToken.dist.colors[key].value);
        variables[varKey] = `${c.red()} ${c.green()} ${c.blue()}`;
    }

    for (const key in designToken.systemToken.dist.colors) {
        const varKey = `${prefix ? `${prefix}-` : ''}sys-color-${key}`.replaceAll('.', '-').toLowerCase();
        if (checkDuplicate && variables[varKey]) {
            throw new Error(`Duplicate key: 'key'. (varName: ${varKey})`);
        }
        const c = Color(designToken.refToken.dist.colors[key].value);
        variables[varKey] = `${c.red()} ${c.green()} ${c.blue()}`;
    }

    if (subDesignToken) {
    }
    return (
        <DesignTokenContext.Provider value={designToken}>
            <TopSubSystemTokenDispatchContext.Provider value={setSubDesignToken}>
                <CssVariableProvider variables={variables}>{children}</CssVariableProvider>
            </TopSubSystemTokenDispatchContext.Provider>
        </DesignTokenContext.Provider>
    );
};

export const SubDesignTokenProvider = ({
    subSystemToken = null,
    children,
}: {
    children?: ReactNode;
    subSystemToken?: SubSystemTokenParam<any, any> | null;
}) => {
    const [subDesignToken, setSubDesignToken] = useState(subSystemToken);
    const p = useContext(DesignTokenContext);
    if (!p) {
        throw new Error('DesignTokenProvider is not defined');
    }
    if (p.options.singleTheme) {
        throw new Error('Single theme is not supported');
    }
    console.log(subDesignToken);
    const variables = {};
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
    variables: Record<string, string>;
}) => {
    const style: Record<string, string> = {};
    for (const key in variables) {
        style[`--${key}`] = variables[key];
    }
    if (Object.keys(style).length === 0) {
        return <>{children}</>;
    }
    return <div style={style}>{children}</div>;
};
