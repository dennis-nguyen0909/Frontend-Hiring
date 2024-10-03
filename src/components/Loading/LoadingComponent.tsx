import { Spin } from 'antd';
import React from 'react'
import { ILoadingComponentProps } from '../types';

const LoadingComponent = ({ children, isLoading, delay }:ILoadingComponentProps) => {
    return (
        <Spin spinning={isLoading} delay={delay}  >
            {children}
        </Spin >
    )
}

export default LoadingComponent;