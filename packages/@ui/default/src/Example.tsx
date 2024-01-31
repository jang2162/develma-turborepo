import React from 'react';

interface Props {
    children?: React.ReactElement | string;
}

function Example({ children }: Props) {
    return <button className={'text-2xl text-red-500'}>## {children} ##</button>;
}

export default Example;
