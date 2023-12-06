import {
    LazyQueryResultTuple,
    OperationVariables,
    SubscriptionHookOptions,
    useLazyQuery,
    useMutation,
    useQuery,
    useSubscription,
    useSuspenseQuery,
} from '@apollo/client';
import { UseSuspenseQueryResult } from '@apollo/client/react/hooks/useSuspenseQuery';
import {
    LazyQueryHookOptions,
    MutationHookOptions,
    MutationTuple,
    NoInfer,
    QueryHookOptions,
    QueryResult,
    SubscriptionResult,
    SuspenseQueryHookOptions,
} from '@apollo/client/react/types/types';

import { DeepPartial } from '@apollo/client/utilities';

import { GqlWrapper } from '../GqlWrapper';

export function useGqlServiceQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
    gqlWrapper: GqlWrapper<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
    return useQuery(gqlWrapper.getDocumentNode(), options);
}
export function useGqlSuspenseQuery<
    TData,
    TVariables extends OperationVariables,
    TOptions extends Omit<SuspenseQueryHookOptions<TData>, 'variables'>,
>(
    gqlWrapper: GqlWrapper<TData, TVariables>,
    options?: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> & TOptions,
): UseSuspenseQueryResult<
    TOptions['errorPolicy'] extends 'ignore' | 'all'
        ? TOptions['returnPartialData'] extends true
            ? DeepPartial<TData> | undefined
            : TData | undefined
        : TOptions['returnPartialData'] extends true
        ? TOptions['skip'] extends boolean
            ? DeepPartial<TData> | undefined
            : DeepPartial<TData>
        : TOptions['skip'] extends boolean
        ? TData | undefined
        : TData,
    TVariables
> {
    return useSuspenseQuery(gqlWrapper.getDocumentNode(), options);
}
export function useGqlServiceLazyQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
    gqlWrapper: GqlWrapper<TData, TVariables>,
    options?: LazyQueryHookOptions<TData, TVariables>,
): LazyQueryResultTuple<TData, TVariables> {
    return useLazyQuery(gqlWrapper.getDocumentNode(), options);
}

export function useGqlServiceMutation<T = any, TVariables extends OperationVariables = OperationVariables>(
    gqlWrapper: GqlWrapper<T, TVariables>,
    options?: MutationHookOptions<T, TVariables>,
): MutationTuple<T, TVariables> {
    return useMutation(gqlWrapper.getDocumentNode(), options);
}

export function useGqlServiceSubscription<TData = any, TVariables extends OperationVariables = OperationVariables>(
    gqlWrapper: GqlWrapper<TData, TVariables>,
    options?: SubscriptionHookOptions<TData, TVariables>,
): SubscriptionResult<TData, TVariables> {
    return useSubscription(gqlWrapper.getDocumentNode(), options);
}
