import { ApolloLink, gql, HttpLink, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { SSRMultipartLink } from '@apollo/experimental-nextjs-app-support/ssr';
import { createClient } from 'graphql-ws';
import { parseString as parseStringSetCookie } from 'set-cookie-parser';
import { Observable } from 'zen-observable-ts';

import { IntrospectionUtil } from './IntrospectionUtil';

const isBrowser = typeof window !== 'undefined';
const REFRESH_TOKEN = gql`
    mutation {
        refreshToken
    }
`;

const SSRTokenCookieLink = new ApolloLink((operation, forward) => {
    const context = operation.getContext();
    const token = context.token;
    if (token) {
        operation.setContext({
            ...context,
            headers: {
                ...context?.headers,
                cookie: `token=${token?.value}`,
            },
        });
    }
    return forward(operation).flatMap((result) => {
        if (!isBrowser) {
            const setCookieHeader = operation
                .getContext()
                ?.response.headers.get('set-cookie');
            const setCookies: string[] = setCookieHeader
                ? setCookieHeader.split(',')
                : [];
            if (setCookies) {
                result.extensions = {
                    ...result?.extensions,
                    tokenSetCookie: setCookies.find(
                        (item) => parseStringSetCookie(item).name === 'token',
                    ),
                };
            }
        }
        return Observable.of(result);
    });
});

const getIntrospectionFormatLink = (introspectionUtil: IntrospectionUtil) =>
    new ApolloLink((operation, forward) => {
        operation.variables = introspectionUtil.serialize(
            operation.variables,
            operation.query,
        );
        return forward(operation).map((response) => {
            if (response.data) {
                response.data = introspectionUtil.parseData(
                    response.data,
                    operation.query,
                );
            }
            return response;
        });
    });

const getAuthLink = (httpLink: ApolloLink) =>
    new ApolloLink((operation, forward) => {
        const context = operation.getContext();
        const token = context.token;

        return forward(operation).flatMap((result) => {
            if (
                result.errors &&
                result.errors.find(
                    (err) => err.extensions?.code === 'ACCESS_TOKEN_EXPIRED',
                ) != null
            ) {
                return ApolloLink.execute(
                    ApolloLink.from([SSRTokenCookieLink, httpLink]),
                    {
                        query: REFRESH_TOKEN,
                        context: token
                            ? {
                                  headers: {
                                      cookie: `token=${token}`,
                                  },
                              }
                            : undefined,
                    },
                ).flatMap((refreshResult) => {
                    if (refreshResult?.extensions?.tokenSetCookie) {
                        operation.setContext({
                            ...context,
                            headers: {
                                ...context?.headers,
                                cookie: `token=${token?.value}`,
                            },
                        });
                        return forward(operation).flatMap((newResult) => {
                            newResult.extensions = {
                                ...newResult?.extensions,
                                tokenSetCookie:
                                    refreshResult?.extensions?.tokenSetCookie,
                            };
                            return Observable.of(newResult);
                        });
                    } else {
                        return Observable.of(refreshResult);
                        // 추후 ACCESS_TOKEN_NOT_EXPIRED 고려
                    }
                });
            }
            return Observable.of(result);
        });
    });

const getHttpLink = (csrEndpoints: string, ssrEndpoints: string) =>
    new HttpLink({
        uri: isBrowser ? csrEndpoints : ssrEndpoints,
        credentials: 'include',
    });

const getWsLink = (endpoint: string) =>
    isBrowser
        ? new GraphQLWsLink(
              createClient({
                  url: endpoint,
                  connectionParams: async () => ({ dt: new Date() + '' }),
              }),
          )
        : null;

const errorLink = onError(({ graphQLErrors, networkError }) => {
    for (const error of graphQLErrors ?? []) {
        const { message, locations, path, extensions } = error;
        console.error(
            `[GraphQL error]: Message: ${
                extensions?.code ?? ''
            } ${message}, Location: ${JSON.stringify(
                locations,
            )}, Path: ${path}`,
        );
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

export type ApolloLinkBuilder = (
    isClientSide: boolean,
    ...links: ApolloLink[]
) => ApolloLink;

export function getApolloLinkBuilder(
    endpoints: {
        csr: string;
        ssr: string;
        ws: string;
    },
    introspectionUtil: IntrospectionUtil,
) {
    const httpLink = getHttpLink(endpoints.csr, endpoints.ssr);
    const authLink = getAuthLink(httpLink);
    const wsLink = getWsLink(endpoints.ws);

    const introspectionFormatLink =
        getIntrospectionFormatLink(introspectionUtil);
    return (isClientSide: boolean, ...links: ApolloLink[]) => {
        return ApolloLink.from([
            ...links,
            introspectionFormatLink,
            errorLink,
            split(
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                    );
                },
                ApolloLink.from([...(wsLink ? [wsLink] : [])]),
                ApolloLink.from([
                    SSRTokenCookieLink,
                    authLink,
                    ...(isClientSide && !isBrowser
                        ? [
                              new SSRMultipartLink({
                                  stripDefer: true,
                              }),
                          ]
                        : []),
                    httpLink,
                ]),
            ),
        ]);
    };
}
