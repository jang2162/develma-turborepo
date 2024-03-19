import { HTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';
import type { MaterialSymbol } from 'material-symbols';

import { twMerge } from 'tailwind-merge';

import { SIZE } from '../../constant';

type IconProps = HTMLAttributes<{}> & {
    /** 아이콘 유형 */
    type: 'material-symbols' | 'image';

    /** 아이콘 크기 */
    size?: SIZE;

    /** 아이콘 스타일*/
    iconStyle?: 'outlined' | 'rounded' | 'sharp';

    /** (type material-symbols) */
    fill?: boolean;

    /** (type material-symbols) */
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

    /** (type material-symbols) */
    grade?: -25 | 0 | 200;

    /** (type material-symbols) */
    opticalSize?: 20 | 24 | 40 | 48;

    /** (type material-symbols) */
    gl?: MaterialSymbol;

    /** (type image) 이미지 경로 */
    src?: string;
} & (
        | {
              /** 아이콘 유형 */
              type: 'material-symbols';

              /** 아이콘 스타일*/
              iconStyle: 'outlined' | 'rounded' | 'sharp';

              /** (type material-symbols) */
              fill?: boolean;

              /** (type material-symbols) */
              weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

              /** (type material-symbols) */
              grade?: -25 | 0 | 200;

              /** (type material-symbols) */
              opticalSize?: 20 | 24 | 40 | 48;

              /** (type material-symbols) */
              gl: MaterialSymbol;
          }
        | {
              /** 아이콘 유형 */
              type: 'image';

              /** (type image) 이미지 경로 */
              src: string;
          }
    );

const icon = cva('inline-block text-nowrap not-italic', {
    variants: {
        size: {
            sm: 'h-5 text-[1.25rem] leading-none',
            md: 'h-6 text-[1.5rem] leading-none',
            lg: 'h-10 text-[2.5rem] leading-none',
            xl: 'h-12 text-[3rem] leading-none',
        },
        type: {
            image: 'w-auto',
            'material-symbols': '',
        },
        iconStyle: {
            outlined: 'font-material-symbols-outlined',
            rounded: 'font-material-symbols-rounded',
            sharp: 'font-material-symbols-sharp',
        },
    },
    defaultVariants: {
        size: 'md',
        iconStyle: 'outlined',
        type: 'material-symbols',
    },
});

const Icon = (prop: IconProps) => {
    const { type, size } = prop;
    if (type === 'image') {
        prop;
        return <img alt={''} src={prop.src} className={twMerge(icon({ size, type }), prop.className)} />;
    } else {
        prop;
        const {
            fill = false,
            weight = 400,
            grade = 0,
            opticalSize = 24,
            iconStyle = 'outlined',
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
                className={twMerge(icon({ size, type, iconStyle }), prop.className)}
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
};

export { Icon };
export type { IconProps };
