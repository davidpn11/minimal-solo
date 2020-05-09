import React from 'react';
import { PassButtonProps, PassButton } from './styles';

import { ReactComponent as PassIcon } from '../../assets/svg/PassIcon.svg';

export type PassButtonStates = 'CAN_PASS' | 'CANNOT_PASS' | 'PASSED';
export type Props = {
  state: PassButtonStates;
  onClick(event: React.MouseEvent): void;
};

function mapStates(state: PassButtonStates): PassButtonProps {
  switch (state) {
    case 'CAN_PASS':
      return { isPassable: true, isActive: false };
    case 'PASSED':
      return { isPassable: false, isActive: true };
    case 'CANNOT_PASS':
      return { isPassable: false, isActive: false };
    default:
      throw new Error('Impossible state at PassButton');
  }
}

export function Pass(props: Props) {
  const { isPassable, isActive } = mapStates(props.state);

  return (
    <PassButton isPassable={isPassable} isActive={isActive} onClick={props.onClick}>
      <PassIcon />
    </PassButton>
  );
}
