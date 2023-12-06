import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

import { ApolloLinkBuilder } from '../apolloLinkBuilder';

export const makeRscApolloClient = (apolloLinkBuilder: ApolloLinkBuilder, getToken: () => string) =>
    registerApolloClient(() => {
        const token = getToken();
        return new ApolloClient({
            cache: new InMemoryCache(),
            link: apolloLinkBuilder(
                false,
                setContext((operation, prevContext) => ({
                    ...prevContext,
                    token,
                })),
            ),
        });
    });
