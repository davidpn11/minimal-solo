import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Lobby } from './Lobby';
import { Game } from './Game';
import { getPlayerValue } from '../store/playerHand/selector';
import { isPlayerInTheGame } from '../store/playerHand/helpers/player';
import { unitJSX } from '../utils/unit';
import { useSessionListener } from '../hooks/useSessionListener';

export default function App() {
  const { currentSession } = useSessionListener();
  const player = useSelector(getPlayerValue);
  const history = useHistory();

  useEffect(
    function rejectNonPlayers() {
      if (currentSession.status === 'STARTED' && !isPlayerInTheGame(player, currentSession)) {
        history.push('/');
      }
    },
    [currentSession, player, history],
  );

  switch (currentSession.status) {
    case 'LOBBY':
    case 'STARTING':
      return <Lobby />;
    case 'STARTED':
      if (isPlayerInTheGame(player, currentSession)) {
        return <Game />;
      }
      return unitJSX;
    default:
      throw new Error('Not a valid session status');
  }
}
