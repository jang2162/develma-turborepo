import { join, dirname } from 'path';
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}

const panelExclude = setConsoleOptions({}).panelExclude;
setConsoleOptions({
    panelExclude: [...panelExclude, /deprecated/],
});
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
    stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-actions'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/preset-create-react-app'),
        getAbsolutePath('storybook-dark-mode'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {
            builder: {
                useSWC: true,
            },
        },
    },
    docs: {
        autodocs: 'tag',
    },
    staticDirs: ['..\\public'],
};
export default config;
