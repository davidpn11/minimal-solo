import React from 'react';
import { select, withKnobs } from '@storybook/addon-knobs';

import { Solo } from './index';
import { SoloButtonStates } from './styles';

const STATES: Record<string, SoloButtonStates> = {
  CanSolo: 'CAN_SOLO',
  CannotSolo: 'CANNOT_SOLO',
  IsSolo: 'IS_SOLO',
  DidntSolo: 'DIDNT_SOLO',
};

export function SoloStory() {
  const statesKnob = select('State', STATES, 'CAN_SOLO');

  return <Solo state={statesKnob} onClick={() => {}} />;
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: SoloStory,
  decorators: [withKnobs],
};
