import localFont from 'next/font/local';
import '@resources/fonts/pretendard/PretendardVariable.woff2';

export const pretendardFont = localFont({
    src: '../../resources/fonts/pretendard/PretendardVariable.woff2',
    variable: '--font-pretendard',
    display: 'block',
});
