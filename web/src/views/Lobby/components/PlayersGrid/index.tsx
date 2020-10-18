import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import React from 'react';
import { useSelector } from 'react-redux';
import { getSessionValue } from '../../../../store/session/selectors';
import { getPlayerIdValue, isCurrentPlayerAdmin } from '../../../../store/playerHand/selector';
import { LobbyPlayerCard } from '../../../../components/LobbyPlayerCard';
import { AdminPlayer, CurrentPlayer, PlayersWrapper } from './styles';

export function PlayersGrid() {
  const currentSession = useSelector(getSessionValue);
  const currentPlayerId = useSelector(getPlayerIdValue);
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
      {!isAdmin && <CurrentPlayer>{currentPlayer}</CurrentPlayer>}
      <AdminPlayer>{adminPlayer}</AdminPlayer>
      {commonPlayers}
    </PlayersWrapper>
  );
}
