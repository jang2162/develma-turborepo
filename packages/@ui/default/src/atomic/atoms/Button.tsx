import { ButtonHTMLAttributes } from 'react';

import { Button as HButton, ButtonProps as HButtonProps } from '@headlessui/react';

import { cva } from 'class-variance-authority';

import { twMerge } from 'tailwind-merge';

import { SIZE, STATE } from '../../constant';
import { useTheme } from '../../ThemeProvider';

type ButtonProps = Omit<HButtonProps, 'className'> &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        /** 버튼 텍스트*/
        label?: string;

        /** 버튼 사이즈 */
        size?: SIZE;

        /** 버튼 상태 강제 지정 */
        overrideState?: STATE;
    };

const button = cva('', {
    variants: {
        size: {
            sm: 'px-2 py-1 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-4 py-2 text-base',
            xl: 'px-4 py-2 text-base',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const Button = ({ overrideState, size, ...prop }: ButtonProps) => {
    const theme = useTheme();
    return (
        <HButton className={twMerge(button({ size }), prop.className)} {...prop}>
            {prop.children || prop.label}
        </HButton>
    );
};

export { Button };
export type { ButtonProps };
