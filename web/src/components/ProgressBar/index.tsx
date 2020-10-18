import React from 'react';
import { InfiniteProgress, Progress, ProgressWrapper } from './styles';

type InfiniteLoaderProps = {
  type: 'infinite-loading';
};

type ProgressLoaderProps = {
  type: 'progress-loader';
  progress: number;
};

type Props = InfiniteLoaderProps | ProgressLoaderProps;

export function ProgressBar(props: Props) {
  switch (props.type) {
    case 'infinite-loading':
      return (
        <ProgressWrapper>
          <InfiniteProgress />
        </ProgressWrapper>
      );
    case 'progress-loader':
      return (
        <ProgressWrapper>
          <Progress progress={props.progress} />
        </ProgressWrapper>
      );
  }
}
