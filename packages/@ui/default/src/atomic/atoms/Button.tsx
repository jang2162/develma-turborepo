import { Button as HeadlessuiButton, ButtonProps as HeadlessuiButtonProps } from '@headlessui/react';

type ButtonProps = HeadlessuiButtonProps & {
    overrideState?: 'hover' | 'focus' | 'active' | 'disabled';
};
const Button = (prop: ButtonProps) => {
    return <HeadlessuiButton {...prop} />;
};

export { Button };
export type { ButtonProps };
