import { NextSSRInMemoryCache, NextSSRApolloClient } from '@apollo/experimental-nextjs-app-support/ssr';

import { ApolloLinkBuilder } from '../apolloLinkBuilder';

export const makeSsrApolloClient = (apolloLinkBuilder: ApolloLinkBuilder) => () =>
    new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link: apolloLinkBuilder(true),
    });
