import React, { FunctionComponent } from 'react';
import { useSessionListener } from '../hooks/useSessionListener';

// type Props = {
//   // children: React.ReactChildren;
// };

const GameEngine: FunctionComponent = props => {
  console.log('oi');
  useSessionListener();
  return <>{props.children}</>;
};

export default GameEngine;
