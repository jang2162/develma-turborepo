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
    return theme;
};

export const useThemeDispatch = () => {
    const dispatch = useContext(ThemeDispatchContext);
    return dispatch;
};

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
    const [theme, dispatch] = useReducer(themeReducer, {
        button: {
            shape: 'rounded',
        },
    });
    return (
        <ThemeContext.Provider value={theme}>
            <div className="text-cc p-1 text-5xl">
                ad asd a dsad
                <ThemeDispatchContext.Provider value={dispatch}>{children}</ThemeDispatchContext.Provider>
            </div>
        </ThemeContext.Provider>
    );
};

function themeReducer(theme: Theme, action: ThemeAction) {
    return {
        ...theme,
    };
}
