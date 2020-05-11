import React from 'react';
import { useSelector } from 'react-redux';

import { EventCount, HistoryWrapper, PlayersWrapper, Title, Wrapper } from './styles';
import { PlayerCard } from '../PlayerCard';
import { getAllPlayers } from '../../store/session/selectors';

export function Side() {
  const players = useSelector(getAllPlayers);

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
        <div>Items here</div>
        <EventCount>0 more actions happened.</EventCount>
      </HistoryWrapper>
    </Wrapper>
  );
}
