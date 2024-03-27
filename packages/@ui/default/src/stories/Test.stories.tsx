import type { Meta, StoryObj } from '@storybook/react';
import { SubDesignTokenProvider } from '@util/design-token';

import { mantis } from '../tokens/subSystem/mantis';
function TestComponent(prop: { children?: React.ReactNode }) {
    return <div>{prop.children}</div>;
}

const meta: Meta<typeof TestComponent> = {
    component: TestComponent,
};

export default meta;

type Story = StoryObj<typeof TestComponent>;

export const Default: Story = {
    render: () => {
        return (
            <TestComponent>
                <div className={'text-sys-test3'}>HELLO</div>
                <SubDesignTokenProvider subSystemToken={mantis}>
                    <div className={'text-sys-test3'}>HELLO</div>
                </SubDesignTokenProvider>
            </TestComponent>
        );
    },
};
