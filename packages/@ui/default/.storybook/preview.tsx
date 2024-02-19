import '../src/tailwind.css';
import { useDarkMode } from 'storybook-dark-mode';
import { DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
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
