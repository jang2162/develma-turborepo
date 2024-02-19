import React from 'react';

interface Props {
    children?: React.ReactElement | string;
}

function Example({ children }: Props) {
    return (
        <>
            <button
                className="bg-gray-600 px-4 text-3xl text-white dark:bg-red-600 dark:text-gray-900"
                onClick={() => console.log('123444')}
            >
                {children}sss
            </button>
        </>
    );
}

export default Example;
