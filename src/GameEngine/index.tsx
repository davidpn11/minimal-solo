import React, { FunctionComponent } from 'react';
import { useHandListener } from '../hooks/useHandListener';
import { useProgressionListener } from '../hooks/useProgressionListener';

// type Props = {
//   // children: React.ReactChildren;
// };

const GameEngine: FunctionComponent = props => {
  useHandListener();
  useProgressionListener();
  return <>{props.children}</>;
};

export default GameEngine;
