import React from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { ActionWrapper, Code, Page, Title, LobbyWrapper } from './styles';
import { JoinModal } from './components/JoinModal';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import {
  allPlayersReady,
  getCurrentSessionPlayer,
  getSessionValue,
} from '../../store/session/selectors';
import { isCurrentPlayerAdmin, getPlayerIdValue } from '../../store/playerHand/selector';
import { useMatchMaker } from '../../hooks/useMatchMaker';
import { useSessionListener } from '../../hooks/useSessionListener';
import { PlayersGrid } from './components/PlayersGrid';

export function Lobby() {
  const currentSession = useSelector(getSessionValue);
  const isAllPlayersReady = useSelector(allPlayersReady);
  const currentPlayerId = useSelector(getPlayerIdValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const isStarting = currentSession.status === 'STARTING';
  const { toggleStatus, startGame } = useMatchMaker();
  useSessionListener();

  return (
    <Page>
      {isStarting && <ProgressBar type="infinite-loading" />}
      <LobbyWrapper>
        <Title>Room Code</Title>
        <Code aria-label="Lobby Room Code">{currentSession.code}</Code>
        <Title>Players</Title>
        <PlayersGrid />
        <ActionWrapper>
          {pipe(
            currentSessionPlayer,
            O.fold(
              () => <div />,
              player => {
                if (isStarting) {
                  return (
                    <Button aria-label="Lobby Starting Game Button" onClick={startGame} disabled>
                      Starting game...
                    </Button>
                  );
                }

                return isAdmin ? (
                  <Button
                    aria-label="Lobby Start Game Button"
                    onClick={startGame}
                    disabled={!isAllPlayersReady}
                  >
                    Start Game
                  </Button>
                ) : (
                  <Button
                    aria-label="Lobby Ready Button"
                    variant={player.status === 'READY' ? 'secondary' : 'primary'}
                    onClick={toggleStatus(currentPlayerId, player.status)}
                  >
                    {player.status === 'READY' ? 'Ready' : 'Not Ready'}
                  </Button>
                );
              },
            ),
          )}
        </ActionWrapper>
        <JoinModal />
      </LobbyWrapper>
    </Page>
  );
}
