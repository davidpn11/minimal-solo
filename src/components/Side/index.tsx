import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { EventCount, HistoryWrapper, PlayersWrapper, Title, Wrapper } from './styles';
import { PlayerCard } from '../PlayerCard';
import {
  getAllPlayers,
  getPlays,
  getSessionValue,
  getStartedSession,
} from '../../store/session/selectors';
import { HistoryItem } from '../HistoryItem';
import { HISTORY_ITEM_HEIGHT } from '../HistoryItem/styles';
import { getPlayerIdValue } from '../../store/playerHand/selector';

export function Side() {
  const [showCount, setShowCount] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const players = useSelector(getAllPlayers);
  const plays = useSelector(getPlays);
  const playerId = useSelector(getPlayerIdValue);
  const currentSession = useSelector(getStartedSession);

  useEffect(() => {
    if (!!wrapperRef.current && !!historyRef.current) {
      const wrapperHeight = wrapperRef.current.clientHeight;
      const historyHeight = historyRef.current.clientHeight;
      const spaceToUse = wrapperHeight - historyHeight;
      const itemSlots = Math.floor(spaceToUse / HISTORY_ITEM_HEIGHT);

      if (plays.length > itemSlots) setShowCount(true);
      else setShowCount(false);
    }
  }, [wrapperRef, historyRef, plays]);

  return (
    <Wrapper ref={wrapperRef}>
      <Title>Players</Title>
      <PlayersWrapper>
        {Object.entries(players).map(([id, player], index) => (
          <PlayerCard
            isCurrentPlayer={currentSession.currentPlayer === id}
            key={`${player.name}-${index}`}
            player={player}
          />
        ))}
      </PlayersWrapper>
      <Title>History</Title>
      <HistoryWrapper ref={historyRef}>
        {plays.map((play, index) => (
          <HistoryItem key={`${play.type}-${play.player.name}-${index}`} play={play} />
        ))}
        {showCount && <EventCount>{plays.length} more actions happened.</EventCount>}
      </HistoryWrapper>
    </Wrapper>
  );
}
