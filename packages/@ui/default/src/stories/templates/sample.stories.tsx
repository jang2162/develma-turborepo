import { Meta, StoryObj } from '@storybook/react';

const Template = () => {
    return (
        <>
            <div className={'text-6xl text-cyan-600'}> 안녕 </div>
        </>
    );
};

const meta: Meta = {
    component: Template,
    render: () => <Template />,
};
export default meta;

export const TestTemplate: StoryObj = {};
