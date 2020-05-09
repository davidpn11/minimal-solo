import React, { FunctionComponent } from 'react';
import { useHandListener } from '../hooks/useHandListener';

// type Props = {
//   // children: React.ReactChildren;
// };

const GameEngine: FunctionComponent = props => {
  useHandListener();
  return <>{props.children}</>;
};

export default GameEngine;
