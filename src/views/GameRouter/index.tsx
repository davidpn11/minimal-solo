import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { GameWrapper } from './styles';
import { PlayerHand } from '../../components/PlayerHand';
import GameTable from './components/GameTable';
import { getSession } from '../../store/session/selectors';
import Lobby from '../Lobby';
import GameEngine from '../../GameEngine';
import { useSessionListener } from '../../hooks/useSessionListener';
import { getPlayer } from '../../store/playerHand/selector';

const TEST_MODE = true;

export default function GameRouter() {
  const currentSession = useSelector(getSession);
  const player = useSelector(getPlayer);
  const history = useHistory();
  const hasSession = !!currentSession.code;
  useSessionListener();

  if (!hasSession && !TEST_MODE) {
    history.push('/');
  }

  switch (currentSession.status) {
    case 'INITIAL':
      return <Lobby />;
    case 'STARTED':
      return (
        <GameEngine>
          <GameWrapper>
            <GameTable />
            <PlayerHand pass="CANNOT_PASS" solo="CANNOT_SOLO" cards={player.hand} />
          </GameWrapper>
        </GameEngine>
      );
    default:
      throw new Error('Not a valid session status');
  }
}
