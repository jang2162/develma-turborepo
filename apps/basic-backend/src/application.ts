import { GqlAppBuilder } from '@base/apollo-server/src';
import { createGqlLogMiddleware, dbMiddleware } from '@base/apollo-server/src/middlewares';
import { loadFilesSync } from '@graphql-tools/load-files';
import { loggerEnvUtil } from '@util/logger';
import { Env } from './env';

const logMiddleware = createGqlLogMiddleware(
    loggerEnvUtil(Env.LOG_GQL_CONSOLE_LEVEL, Env.LOG_GQL_FILE_LEVEL, Env.LOG_GQL_FILE_DIR),
);
export const application = new GqlAppBuilder({
    typeDefs: loadFilesSync('../node_modules/basic-graphql/typeDefs/**/*.graphql'),
    modules: [],
    middlewares: {
        '*': {
            '*': [dbMiddleware],
        },
        Query: {
            '*': [logMiddleware],
        },
        Mutation: {
            '*': [logMiddleware],
        },
        Subscription: {
            '*': [logMiddleware],
        },
    },
});
