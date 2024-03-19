import '../src/tailwind.css';
import { ThemeProvider } from '../src/ThemeProvider';
import { useDarkMode } from 'storybook-dark-mode';
import { DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import { Preview } from '@storybook/react';
import { useEffect } from 'react';

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            expanded: true,
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
