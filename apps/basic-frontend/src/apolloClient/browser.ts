'use client';

import { IntrospectionUtil } from '@base/apollo-client';
import { initBaseApolloClient } from '@base/apollo-client/browser';
import introspectionJson from 'basic-graphql/introspection.json';

import { Env } from '@/env';

const { makeClient } = initBaseApolloClient({
    endpointUrl: {
        csr: Env.GRAPHQL_ENDPOINT_URL_CSR,
        ssr: Env.GRAPHQL_ENDPOINT_URL_SSR,
        ws: Env.GRAPHQL_ENDPOINT_URL_WS,
    },
    introspectionUtil: new IntrospectionUtil(introspectionJson as any),
});

export { makeClient };
