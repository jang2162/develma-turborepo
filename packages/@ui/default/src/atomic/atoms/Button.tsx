import { Button as HButton, ButtonProps as HButtonProps } from '@headlessui/react';

import { SIZE, STATE } from '../../constant';

type ButtonProps = HButtonProps & {
    overrideState?: STATE;
    size?: SIZE;
};
const Button = (prop: ButtonProps) => {
    return <HButton className={'text-red-500'} {...prop} />;
};

export { Button };
export type { ButtonProps };
