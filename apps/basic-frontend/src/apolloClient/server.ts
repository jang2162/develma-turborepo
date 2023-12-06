import { IntrospectionUtil } from '@base/apollo-client';
import { initBaseApolloClient } from '@base/apollo-client/server';
import introspectionJson from 'basic-graphql/introspection.json';
import { cookies } from 'next/headers';

import { Env } from '@/env';

const { gqlQueryBuilder, gqlMutateBuilder, gqlSubscribe } = initBaseApolloClient(() => cookies().get('token').value, {
    endpointUrl: {
        csr: Env.GRAPHQL_ENDPOINT_URL_CSR,
        ssr: Env.GRAPHQL_ENDPOINT_URL_SSR,
        ws: Env.GRAPHQL_ENDPOINT_URL_WS,
    },
    introspectionUtil: new IntrospectionUtil(introspectionJson as any),
});

export { gqlQueryBuilder, gqlMutateBuilder, gqlSubscribe };
