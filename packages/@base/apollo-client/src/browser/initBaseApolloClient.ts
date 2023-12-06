import { getApolloLinkBuilder } from '../apolloLinkBuilder';
import { InitBaseApolloClientOptions } from '../InitBaseApolloClientOptions';
import { makeSsrApolloClient } from './makeSsrApolloClient';

export function initBaseApolloClient(options: InitBaseApolloClientOptions) {
    const apolloLinkBuilder = getApolloLinkBuilder(
        {
            ws: options.endpointUrl.ws,
            csr: options.endpointUrl.csr,
            ssr: options.endpointUrl.ssr,
        },
        options.introspectionUtil,
    );
    return {
        makeClient: makeSsrApolloClient(apolloLinkBuilder),
    };
}
