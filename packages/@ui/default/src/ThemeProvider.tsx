import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

export type Theme = {
    button: {
        shape: 'rounded' | 'square' | 'pill';
    };
};

type ThemeAction = {
    type: string;
    count: number;
};

const ThemeContext = createContext<null | Theme>(null);
const ThemeDispatchContext = createContext<null | Dispatch<ThemeAction>>(null);

export const useTheme = () => {
    const theme = useContext(ThemeContext);
    console.log(theme, 123);
    return theme;
};

export const useThemeDispatch = () => {
    const dispatch = useContext(ThemeDispatchContext);
    console.log(dispatch, 456);
    return dispatch;
};

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
    const [theme, dispatch] = useReducer(themeReducer, {
        button: {
            shape: 'rounded',
        },
    });
    console.log(theme, 789);
    return (
        <ThemeContext.Provider value={theme}>
            <ThemeDispatchContext.Provider value={dispatch}>{children}</ThemeDispatchContext.Provider>
        </ThemeContext.Provider>
    );
};

function themeReducer(theme: Theme, action: ThemeAction) {
    console.log(theme, action);
    return {
        ...theme,
    };
}
