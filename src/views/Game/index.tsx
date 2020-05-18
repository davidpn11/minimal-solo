import React from 'react';
import { useSelector } from 'react-redux';

import { BoardWrapper, GameWrapper, Main } from './styles';
import GameTable from './components/GameTable';
import { PlayerHand } from '../../components/PlayerHand';
import { Side } from '../../components/Side';
import { useHandListener } from './hooks/useHandListener';
import { useProgressionListener } from './hooks/useProgressionListener';
import { getPlayerValue } from '../../store/playerHand/selector';

export function Game() {
  const player = useSelector(getPlayerValue);
  const { playerActions, handlePass } = useHandListener();
  useProgressionListener();

  return (
    <GameWrapper>
      <Main>
        <BoardWrapper>
          <GameTable />
        </BoardWrapper>
        {/* These props will come from the Engine */}
        <PlayerHand
          onPass={handlePass}
          pass={playerActions.passAction}
          onSolo={() => {}}
          solo={playerActions.soloAction}
          cards={player.hand}
        />
      </Main>
      <Side />
    </GameWrapper>
  );
}
