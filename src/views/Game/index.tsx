import React from 'react';

import { BoardWrapper, GameWrapper, Main } from './styles';
import GameTable from './components/GameTable';
import { PlayerHand } from '../../components/PlayerHand';
import { Side } from '../../components/Side';
import { useHandListener } from '../../hooks/useHandListener';
import { useProgressionListener } from '../../hooks/useProgressionListener';
import { useSelector } from 'react-redux';
import { getPlayerValue } from '../../store/playerHand/selector';

export function Game() {
  const player = useSelector(getPlayerValue);
  useHandListener();
  useProgressionListener();

  return (
    <GameWrapper>
      <Main>
        <BoardWrapper>
          <GameTable />
        </BoardWrapper>
        {/* These props will come from the Engine */}
        <PlayerHand pass="CANNOT_PASS" solo="CANNOT_SOLO" cards={player.hand} />
      </Main>
      <Side />
    </GameWrapper>
  );
}
