import { cva } from 'class-variance-authority';
import type { MaterialSymbol } from 'material-symbols';

import { SIZE } from '../../constant';

type IconProps = { type: string; size?: SIZE } & {
    type?: 'material-symbols-outlined' | 'material-symbols-rounded' | 'material-symbols-sharp';
    fill?: boolean;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    grade: -25 | 0 | 200;
    opticalSize: 20 | 24 | 40 | 48;
    gl: MaterialSymbol;
};

const icon = cva('line-he inline-block text-nowrap not-italic leading-none', {
    variants: {
        size: {
            sm: 'text-[20px]',
            md: 'text-[24px]',
            lg: 'text-[40px]',
            xl: 'text-[48px]',
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
        const { fill = false, weight = 400, grade = 0, opticalSize = 24, gl } = prop;
        return (
            <i
                className={icon({ type, size })}
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
