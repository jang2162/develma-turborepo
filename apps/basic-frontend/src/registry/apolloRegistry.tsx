'use client';

import React from 'react';

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';

import { makeClient } from '@/apolloClient/browser';

export default function ApolloRegistry({ children }: { children: React.ReactNode }) {
    return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
