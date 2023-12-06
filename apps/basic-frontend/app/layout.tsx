import React from 'react';

import 'src/style';
import { pretendardFont } from '@/fontFace/pretendardFontFace';
import ApolloRegistry from '@/registry/apolloRegistry';
import RecoilRegistry from '@/registry/recoilRegistry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={pretendardFont.variable}>
            <RecoilRegistry>
                <ApolloRegistry>
                    <body>{children}</body>
                </ApolloRegistry>
            </RecoilRegistry>
        </html>
    );
}
