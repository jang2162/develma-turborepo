import { Server } from 'http';
import { ApolloServer } from '@apollo/server';

import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createLogger, SimpleLoggerOptions } from '@util/logger';
import { simpleExpressMiddleware } from '@util/simple-express';
import { isEmpty, shortUUIDv4 } from '@util/tools';
import { Express } from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { DependencyContainer } from 'tsyringe';
import { WebSocketServer } from 'ws';
import { GqlAppBuilder } from './gqlAppBuilder';
import { gqlAppBuilderPlugin } from './gqlAppBuilderPlugin';
import { REQ_KEY, REQUEST, RESPONSE } from './symbols';
import { GqlAppBuilderContext } from './types';
export function createApolloServer(
    app: Express,
    httpServer: Server,
    gqlAppBuilder: GqlAppBuilder,
    getInjector: () => DependencyContainer,
    options?: {
        isProduction?: boolean;
        cors?: {
            origin?: string;
            credentials?: boolean;
        };
        path?: string;
        loggerOptions?: {
            gqlQuery?: SimpleLoggerOptions;
            apolloError?: SimpleLoggerOptions;
        };
    },
) {
    const path = options?.path ?? '/graphql';
    const isProduction = options?.isProduction ?? false;

    const apolloErrorLogger = createLogger<{ path: any; code: any }>('APOLLO_ERROR', {
        ...options?.loggerOptions?.apolloError,
        consoleFormat: ({ message, subData, timestamp }) =>
            `${timestamp} [APOLLO_ERROR]: (${subData.path}${subData.code ? ', ' + subData.code : ''}) ${message}`,
    });
    const gqlQueryLogger = createLogger<{
        reqKey: string;
        query: string;
        params?: any;
    }>('GQL_QUERY', {
        ...options?.loggerOptions?.gqlQuery,
        consoleFormat: ({ level, message, subData, timestamp }) =>
            `${timestamp} [GQL_QUERY] ${level}: #${subData.reqKey}# ${message} \n${subData.query} ${
                subData?.params && !isEmpty(subData.params) ? `=> (Params: ${JSON.stringify(subData.params)})` : ''
            }`,
    });

    const schema = makeExecutableSchema(gqlAppBuilder.build());
    const wsServer = new WebSocketServer({
        server: httpServer,
        path,
    });
    const serverCleanup = useServer({ schema }, wsServer);
    const apolloServer = new ApolloServer<GqlAppBuilderContext>({
        schema,
        formatError: (error) => {
            apolloErrorLogger.error(error.message, {
                path: error.path,
                code: error.extensions && error.extensions.code,
            });
            return error;
        },
        plugins: [
            isProduction
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageLocalDefault({
                      includeCookies: true,
                  }),
            gqlAppBuilderPlugin(isProduction, gqlQueryLogger),
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    app.use(
        path,
        ...simpleExpressMiddleware({
            cors: {
                credentials: options?.cors?.credentials,
                origin: options?.cors?.origin,
            },
        }),
        expressMiddleware<GqlAppBuilderContext>(apolloServer, {
            context: async ({ req, res }) => {
                const reqKey = shortUUIDv4();
                const injector = getInjector();
                injector
                    .register(REQUEST, { useValue: req })
                    .register(RESPONSE, { useValue: res })
                    .register(REQ_KEY, { useValue: reqKey });
                return {
                    injector,
                };
            },
        }),
    );

    return {
        apolloServer,
    };
}
