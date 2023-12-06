module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['prefer-arrow', 'import', 'jsdoc', '@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    '{}': false,
                },
                extendDefaults: true,
            },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        'import/first': 'error',
        'import/no-amd': 'error',
        'import/no-extraneous-dependencies': 'off',
        'import/no-internal-modules': 'off',
        'import/no-unresolved': 'off',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'no-control-regex': 'off',
    },
    ignorePatterns: ['node_modules/', 'dist/'],
    settings: {
        react: {
            version: 'detect',
        },
    },
};
