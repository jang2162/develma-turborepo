import type { Meta, StoryObj } from '@storybook/react';

import Example from '../Example';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Example> = {
    component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

export const FirstStory: Story = {
    args: {
        //👇 The args you need here will depend on your component
    },
};
