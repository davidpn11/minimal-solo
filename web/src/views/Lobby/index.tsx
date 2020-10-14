import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { ActionWrapper, Code, Page, Title, LobbyWrapper } from './styles';
import { JoinModal } from './components/JoinModal';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import {
  allPlayersReady,
  getAllPlayers,
  getCurrentSessionPlayer,
  getSessionValue,
} from '../../store/session/selectors';
import { isCurrentPlayerAdmin, getPlayerIdValue } from '../../store/playerHand/selector';
import { useMatchMaker } from '../../hooks/useMatchMaker';
import { usePlayersGrid } from '../../hooks/usePlayersGrid';
import { LocalNoGameSession } from '../../model/Session';
import { useSessionListener } from '../../hooks/useSessionListener';

type Props = {
  status: LocalNoGameSession['status'];
};

export function Lobby(props: Props) {
  const [progress, setProgress] = useState(0);
  const currentSession = useSelector(getSessionValue);
  const allPlayers = useSelector(getAllPlayers);
  const isAllPlayersReady = useSelector(allPlayersReady);
  const currentPlayerId = useSelector(getPlayerIdValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const playersGrid = usePlayersGrid();
  const isStarting = props.status === 'STARTING';
  useSessionListener();

  useEffect(
    function controlProgress() {
      const playersList = Object.values(allPlayers);
      const playersWithCards = playersList.filter(player => player.hand.length > 0).length;
      const totalPlayerCount = playersList.length;

      if (playersWithCards > 0) {
        const handProgress = playersWithCards / totalPlayerCount;
        const initPlaceholder = 0.1;
        const currentProgress = handProgress - initPlaceholder;
        setProgress(currentProgress * 100);
      }
    },
    [allPlayers],
  );

  const { toggleStatus, startGame } = useMatchMaker();

  return (
    <Page>
      {isStarting && <ProgressBar progress={progress} />}
      <LobbyWrapper>
        <Title>Room Code</Title>
        <Code aria-label="Lobby Room Code">{currentSession.code}</Code>
        <Title>Players</Title>
        {playersGrid}
        <ActionWrapper>
          {pipe(
            currentSessionPlayer,
            O.fold(
              () => <div />,
              player =>
                isAdmin ? (
                  <Button
                    aria-label="Lobby Start Game Button"
                    onClick={startGame}
                    disabled={!isAllPlayersReady || isStarting}
                  >
                    Start Game
                  </Button>
                ) : (
                  <Button
                    aria-label="Lobby Ready Button"
                    disabled={isStarting}
                    variant={player.status === 'READY' ? 'secondary' : 'primary'}
                    onClick={toggleStatus(currentPlayerId, player.status)}
                  >
                    {player.status === 'READY' ? 'Ready' : 'Not Ready'}
                  </Button>
                ),
            ),
          )}
        </ActionWrapper>
        <JoinModal />
      </LobbyWrapper>
    </Page>
  );
}
