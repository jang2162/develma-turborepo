import { HTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';
import type { MaterialSymbol } from 'material-symbols';

import { twMerge } from 'tailwind-merge';

import { SIZE } from '../../constant';

type IconProps = HTMLAttributes<{}> & { type: string; size?: SIZE } & {
    type?: 'material-symbols-outlined' | 'material-symbols-rounded' | 'material-symbols-sharp';
    fill?: boolean;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    grade?: -25 | 0 | 200;
    opticalSize?: 20 | 24 | 40 | 48;
    gl: MaterialSymbol;
};

const icon = cva('inline-block text-nowrap not-italic', {
    variants: {
        size: {
            sm: 'text-[20px] leading-none',
            md: 'text-[24px] leading-none',
            lg: 'text-[40px] leading-none',
            xl: 'text-[48px] leading-none',
        },
        type: {
            'material-symbols-outlined': 'font-material-symbols-outlined',
            'material-symbols-rounded': 'font-material-symbols-rounded',
            'material-symbols-sharp': 'font-material-symbols-sharp',
        },
    },
    defaultVariants: {
        size: 'md',
        type: 'material-symbols-outlined',
    },
});

const Icon = ({ type, size, ...prop }: IconProps) => {
    if (
        type === 'material-symbols-outlined' ||
        type === 'material-symbols-rounded' ||
        type === 'material-symbols-sharp'
    ) {
        const {
            fill = false,
            weight = 400,
            grade = 0,
            opticalSize = 24,
            gl,
        } = {
            ...prop,
            weight: prop.weight || 400,
            grade: prop.grade || 0,
            opticalSize: prop.opticalSize || 24,
        };
        return (
            <i
                translate={'no'}
                className={twMerge(icon({ type, size }), prop.className)}
                style={{
                    fontVariationSettings: `'FILL' ${
                        fill ? 1 : 0
                    }, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
                }}
            >
                {gl}
            </i>
        );
    }
    return null;
};

export { Icon };
export type { IconProps };
