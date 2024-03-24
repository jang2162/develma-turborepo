import '../src/styles/globals.css';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/ThemeProvider';
import { DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        darkMode: {
            stylePreview: true,
        },
        docs: {
            container: ({ children, context }) => {
                const dark = useDarkMode();
                return (
                    <DocsContainer context={context} theme={dark ? themes.dark : themes.light}>
                        {children}
                    </DocsContainer>
                );
            },
        },
    },
};

export default preview;

export const decorators = [
    (Story) => {
        return (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        );
    },
];
