import { envUtil } from '@util/env';

export class Env {
    static readonly NODE_ENV = envUtil.string(process.env.NODE_ENV, 'development');
    static readonly URL = envUtil.stringErr(process.env.NEXT_PUBLIC_URL);
    static readonly GRAPHQL_ENDPOINT_URL_CSR = envUtil.stringErr(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_URL_CSR);
    static readonly GRAPHQL_ENDPOINT_URL_SSR = envUtil.string(
        process.env.GRAPHQL_ENDPOINT_URL_SSR,
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_URL_CSR,
    );

    static readonly GRAPHQL_ENDPOINT_URL_WS = envUtil.stringErr(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_URL_WS);
}
