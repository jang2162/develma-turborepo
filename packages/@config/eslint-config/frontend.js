module.exports = {
    extends: ['./index.js', 'plugin:@next/next/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'import/order': [
            'error',
            {
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'builtin',
                        position: 'before',
                    },
                ],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                pathGroupsExcludedImportTypes: ['react'],
                'newlines-between': 'always-and-inside-groups',
            },
        ],
    },
    ignorePatterns: ['next.config.js', 'node_modules/'],
    settings: {
        react: {
            version: 'detect',
        },
    },
};
