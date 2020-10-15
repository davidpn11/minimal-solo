import React from 'react';
import { Progress, ProgressWrapper } from './styles';

type Props = {
  progress: number;
};

export function ProgressBar(props: Props) {
  return (
    <ProgressWrapper>
      <Progress progress={props.progress} />
    </ProgressWrapper>
  );
}
