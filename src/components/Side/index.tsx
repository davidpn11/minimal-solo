import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';

import {
  EventCount,
  HeightWrapper, HISTORY_ITEM_MARGIN_TOP,
  HistoryWrapper,
  PlayersWrapper,
  Title,
  Wrapper,
} from './styles';
import { PlayerCard } from '../PlayerCard';
import { HistoryItem } from '../HistoryItem';
import { HISTORY_ITEM_HEIGHT } from '../HistoryItem/styles';
import {
  getAllPlayers,
  getOrderedProgression,
  getStartedSession,
} from '../../store/session/selectors';
import { useWindowSize } from '../../hooks/useWindowSize';

export function Side() {
  const { height } = useWindowSize();
  const [showCount, setShowCount] = useState(false);
  const [itemSlots, setItemSlots] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const players = useSelector(getAllPlayers);
  const plays = useSelector(getOrderedProgression);
  const currentSession = useSelector(getStartedSession);

  useEffect(() => {
    if (!!wrapperRef.current && !!heightRef.current) {
      const wrapperHeight = wrapperRef.current.clientHeight;
      const othersHeight = heightRef.current.clientHeight;
      const spaceToUse = wrapperHeight - othersHeight - 32; // 32 is the title height
      const calculatedSlots = Math.floor(spaceToUse / (HISTORY_ITEM_HEIGHT + HISTORY_ITEM_MARGIN_TOP));

      setItemSlots(calculatedSlots);
    }
  }, [wrapperRef, heightRef, height, plays]);

  useEffect(() => {
    if (plays.length > itemSlots) {
      setShowCount(true);
    } else {
      setShowCount(false);
    }
  }, [plays, itemSlots]);

  return (
    <Wrapper ref={wrapperRef}>
      <HeightWrapper ref={heightRef}>
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
      </HeightWrapper>
      <HistoryWrapper>
        {pipe(
          plays,
          A.reverse,
          A.takeLeft(itemSlots),
          A.mapWithIndex((index, play) => (
            <HistoryItem key={`${play.type}-${play.player.name}-${index}`} play={play} />
          )),
        )}
        {showCount && <EventCount>{plays.length - itemSlots} more actions happened.</EventCount>}
      </HistoryWrapper>
    </Wrapper>
  );
}
