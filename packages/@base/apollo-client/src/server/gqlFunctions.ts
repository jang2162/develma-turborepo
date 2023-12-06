import { ApolloClient, MutationOptions, OperationVariables, QueryOptions, SubscriptionOptions } from '@apollo/client';

import { GqlWrapper } from '../GqlWrapper';

export const gqlQueryBuilder = (getClient: () => ApolloClient<any>) =>
    async function <T, TVariables extends OperationVariables = OperationVariables>(
        gqlWrapper: GqlWrapper<T, TVariables>,
        options?: { variables: TVariables } & Omit<QueryOptions, 'query' | 'variables' | 'context'>,
    ) {
        return getClient().query<T>({
            ...options,
            query: gqlWrapper.getDocumentNode(),
        });
    };
export const gqlMutateBuilder = (getClient: () => ApolloClient<any>) =>
    async function <T = any, TVariables extends OperationVariables = OperationVariables>(
        gqlWrapper: GqlWrapper<T, TVariables>,
        options?: { variables: TVariables } & Omit<MutationOptions, 'mutation' | 'variables' | 'context'>,
    ) {
        return getClient().mutate<T>({
            ...options,
            mutation: gqlWrapper.getDocumentNode(),
        });
    };
export const gqlSubscribeBuilder = (getClient: () => ApolloClient<any>) =>
    async function <T = any, TVariables extends OperationVariables = OperationVariables>(
        gqlWrapper: GqlWrapper<T, TVariables>,
        options?: { variables: TVariables } & Omit<SubscriptionOptions, 'query' | 'variables' | 'context'>,
    ) {
        return getClient().subscribe<T>({
            ...options,
            query: gqlWrapper.getDocumentNode(),
        });
    };
