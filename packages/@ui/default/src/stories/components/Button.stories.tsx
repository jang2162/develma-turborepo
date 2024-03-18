import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../atomic/atoms/Button';

const meta: Meta<typeof Button> = {
    component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {},
    render: (props) => {
        return <Button {...props}>test</Button>;
    },
};
