import { getApolloLinkBuilder } from '../apolloLinkBuilder';
import { InitBaseApolloClientOptions } from '../InitBaseApolloClientOptions';
import { gqlMutateBuilder, gqlQueryBuilder, gqlSubscribeBuilder } from './gqlFunctions';
import { makeRscApolloClient } from './makeRscApolloClient';

export function initBaseApolloClient(getToken: () => string, options: InitBaseApolloClientOptions) {
    const apolloLinkBuilder = getApolloLinkBuilder(
        {
            ws: options.endpointUrl.ws,
            csr: options.endpointUrl.csr,
            ssr: options.endpointUrl.ssr,
        },
        options.introspectionUtil,
    );
    const { getClient } = makeRscApolloClient(apolloLinkBuilder, getToken);
    return {
        gqlQueryBuilder: gqlQueryBuilder(getClient),
        gqlMutateBuilder: gqlMutateBuilder(getClient),
        gqlSubscribe: gqlSubscribeBuilder(getClient),
    };
}
