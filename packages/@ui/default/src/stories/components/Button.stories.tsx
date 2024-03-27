import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../atomic/atoms/Button';

const meta: Meta<typeof Button> = {
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        overrideState: { control: 'select' },
        size: { control: 'select' },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        label: 'sample button',
    },
    render: (props) => {
        return <Button className={'text-tt-sys-test3'} {...props} />;
    },
};
