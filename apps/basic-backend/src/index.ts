import { createApolloServer } from '@base/apollo-server/src';
import { loggerEnvUtil } from '@util/logger';
import { createExpressServer } from '@util/simple-express';
import { container } from 'tsyringe';
import { application } from './application';
import { Env } from './env';

const { app, httpServer, start } = createExpressServer({ port: Env.SERVER_PORT });
const { apolloServer } = createApolloServer(app, httpServer, application, () => container, {
    isProduction: Env.NODE_ENV === 'production',
    cors: {
        credentials: Env.CORS_CREDENTIALS,
        origin: Env.CORS_ORIGIN,
    },
    loggerOptions: {
        gqlQuery: loggerEnvUtil(Env.LOG_GQL_CONSOLE_LEVEL, Env.LOG_GQL_FILE_LEVEL, Env.LOG_GQL_FILE_DIR),
        apolloError: loggerEnvUtil(Env.LOG_APOLLO_CONSOLE_LEVEL, Env.LOG_APOLLO_FILE_LEVEL, Env.LOG_APOLLO_FILE_DIR),
    },
});

(async () => {
    await start;
    await apolloServer.start();
})();
