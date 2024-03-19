import React from 'react';

import { cx } from 'class-variance-authority';

import 'src/style';
import {
    materialSymbolssharpFont,
    materialSymbolsroundedFont,
    materialSymbolsoutlinedFont,
} from '@/fontFace/materialSymbolsFontFace';
import { pretendardFont } from '@/fontFace/pretendardFontFace';
import ApolloRegistry from '@/registry/apolloRegistry';
import RecoilRegistry from '@/registry/recoilRegistry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="ko"
            className={cx(
                pretendardFont.variable,
                materialSymbolssharpFont.variable,
                materialSymbolsroundedFont.variable,
                materialSymbolsoutlinedFont.variable,
            )}
        >
            <RecoilRegistry>
                <ApolloRegistry>
                    <body>{children}</body>
                </ApolloRegistry>
            </RecoilRegistry>
        </html>
    );
}
