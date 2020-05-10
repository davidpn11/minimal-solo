import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import React from 'react';
import { useSelector } from 'react-redux';
import { LobbyPlayerCard } from '../components/LobbyPlayerCard';
import { SessionPlayer } from '../model/Player';
import { getPlayerId, isCurrentPlayerAdmin } from '../store/playerHand/selector';
import { getSession } from '../store/session/selectors';
import { AdminPlayer, CurrentPlayer, PlayersWrapper } from '../views/Lobby/styles';

export function usePlayersGrid() {
  const currentSession = useSelector(getSession);
  const currentPlayerId = useSelector(getPlayerId);
  const isAdmin = useSelector(isCurrentPlayerAdmin);

  const isCurrentPlayer = (id: string) => currentPlayerId === id;
  const isAdminPlayer = (player: SessionPlayer) => player.status === 'ADMIN';

  const filterCurrentPlayer = (key: string) => isCurrentPlayer(key);
  const filterAdminPlayer = (key: string, value: SessionPlayer) => isAdminPlayer(value);

  const filterCommonPlayers = (key: string, value: SessionPlayer) => {
    if (isCurrentPlayer(key) || isAdminPlayer(value)) return O.none;
    return O.some(value);
  };

  const renderPlayerArea = (key: string, acc: JSX.Element[], player: SessionPlayer) => {
    return [...acc, <LobbyPlayerCard key={key} player={player} />];
  };

  const renderPlayer = (acc: JSX.Element, player: SessionPlayer) => (
    <LobbyPlayerCard player={player} />
  );

  const adminPlayer = pipe(
    currentSession.players,
    R.filterWithIndex(filterAdminPlayer),
    R.reduce<SessionPlayer, JSX.Element>(<></>, renderPlayer),
  );

  const currentPlayer = pipe(
    currentSession.players,
    R.filterWithIndex(filterCurrentPlayer),
    R.reduce<SessionPlayer, JSX.Element>(<></>, renderPlayer),
  );

  const commonPlayers = pipe(
    currentSession.players,
    R.filterMapWithIndex(filterCommonPlayers),
    R.reduceWithIndex<string, SessionPlayer, JSX.Element[]>([], renderPlayerArea),
  );

  return (
    <PlayersWrapper>
      {/* Checks if current player is admin */}
      {!isAdmin && <CurrentPlayer>{currentPlayer}</CurrentPlayer>}
      <AdminPlayer>{adminPlayer}</AdminPlayer>
      {commonPlayers}
    </PlayersWrapper>
  );
}
