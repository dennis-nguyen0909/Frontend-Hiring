import { Skeleton } from 'antd';
import React from 'react';
import { ILoadingComponentProps } from '../types';

const LoadingComponentSkeleton = ({ children, isLoading, delay }: ILoadingComponentProps) => {
    return (
        <Skeleton
            loading={isLoading}
            active  // Shows the skeleton animation
            avatar  // Adds an avatar to the skeleton
            paragraph={{ rows: 3 }}  // Defines the number of rows for the paragraph skeleton
        >
            {children}
        </Skeleton>
    );
};

export default LoadingComponentSkeleton;
