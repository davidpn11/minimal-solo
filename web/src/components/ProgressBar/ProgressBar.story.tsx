import { number, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { ProgressBar } from './index';

export function ProgressBarStory() {
  const progressKnob = number('Progress', 50, { min: 0, max: 100 });

  return <ProgressBar type="progress-loader" progress={progressKnob} />;
}

export default {
  title: 'MinimalSolo/Components/Base',
  component: ProgressBarStory,
  decorators: [withKnobs],
};
