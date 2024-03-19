import { ButtonHTMLAttributes } from 'react';

import { Button as HButton, ButtonProps as HButtonProps } from '@headlessui/react';

import { cx, cva } from 'class-variance-authority';

import { twMerge } from 'tailwind-merge';

import { SIZE, STATE } from '../../constant';

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
            sm: 'text-sm py-1 px-2',
            md: 'text-base py-2 px-4',
            lg: 'text-base py-2 px-4',
            xl: 'text-base py-2 px-4',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const Button = ({ overrideState, size, ...prop }: ButtonProps) => {
    console.log(overrideState, size);
    return (
        <HButton className={twMerge(button({ size }), prop.className)} {...prop}>
            {prop.children || prop.label}
        </HButton>
    );
};

export { Button };
export type { ButtonProps };
