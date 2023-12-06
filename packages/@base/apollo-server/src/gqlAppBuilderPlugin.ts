import { ApolloServerPlugin } from '@apollo/server';
import { Logger } from '@util/logger';
import { Request } from 'express';
import { REQUEST, REQ_KEY } from './symbols';
import { GqlAppBuilderContext } from './types';

export const gqlAppBuilderPlugin: (
    isProduction: boolean,
    gqlQueryLogger: Logger<{
        reqKey: string;
        query: string;
        params?: any;
    }>,
) => ApolloServerPlugin<GqlAppBuilderContext> = (isProduction, gqlQueryLogger) => ({
    async requestDidStart(requestContext) {
        const { injector } = requestContext.contextValue;
        const req = injector.resolve<Request>(REQUEST);
        const reqKey = injector.resolve<string>(REQ_KEY);
        if (!isProduction && req.body?.operationName === 'IntrospectionQuery') {
            return;
        }
        gqlQueryLogger.info('GQL called.', {
            reqKey,
            query: req.body?.query,
            params: req.body?.variables,
        });

        return {
            async willSendResponse() {
                await injector.dispose();
            },
        };
    },
});
