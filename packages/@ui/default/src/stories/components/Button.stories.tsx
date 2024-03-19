import { useEffect } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../atomic/atoms/Button';
import { ThemeProvider } from '../../ThemeProvider';

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
        return <Button {...props} />;
    },
};
