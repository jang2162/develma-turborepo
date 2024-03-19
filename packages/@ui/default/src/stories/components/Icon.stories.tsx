import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../../atomic/atoms/Icon';

const meta: Meta<typeof Icon> = {
    component: Icon,
    tags: ['autodocs'],
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
    args: {
        gl: 'home',
    },
    render: (props) => {
        return <Icon {...props} />;
    },
};
