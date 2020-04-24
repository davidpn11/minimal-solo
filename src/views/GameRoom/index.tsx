import React, { useEffect } from 'react';
import { GameWrapper } from './styles';
import MyHand from './components/MyHand';
import GameTable from './components/GameTable';

export default function GameRoom() {
  useEffect(() => {
    return () => {
      alert(123);
      window.confirm('Are you sure?');
    }
  }, [])

  return (
    <GameWrapper>
      <GameTable />
      <MyHand />
    </GameWrapper>
  );
}
