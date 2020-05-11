import React from 'react';
import { useSelector } from 'react-redux';

import { EventCount, HistoryWrapper, PlayersWrapper, Title, Wrapper } from './styles';
import { PlayerCard } from '../PlayerCard';
import { getAllPlayers, getPlays } from '../../store/session/selectors';
import { HistoryItem } from '../HistoryItem';

export function Side() {
  const players = useSelector(getAllPlayers);
  const plays = useSelector(getPlays);

  return (
    <Wrapper>
      <Title>Players</Title>
      <PlayersWrapper>
        {Object.values(players).map(player => (
          <PlayerCard player={player} />
        ))}
      </PlayersWrapper>
      <Title>History</Title>
      <HistoryWrapper>
        {plays.map(play => (
          <HistoryItem play={play} />
        ))}
        <EventCount>0 more actions happened.</EventCount>
      </HistoryWrapper>
    </Wrapper>
  );
}
