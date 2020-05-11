import React from 'react';
import { EventCount, HistoryWrapper, Title, Wrapper } from './styles';
import { useSelector } from 'react-redux';
import { getAllPlayers } from '../../store/session/selectors';
import { PlayerCard } from '../PlayerCard';

export function Side() {
  const players = useSelector(getAllPlayers);

  return (
    <Wrapper>
      <Title>Players</Title>
      {Object.values(players).map(player => (
        <PlayerCard player={player} />
      ))}
      <Title>History</Title>
      <HistoryWrapper>
        <div>Items here</div>
        <EventCount>0 more actions happened.</EventCount>
      </HistoryWrapper>
    </Wrapper>
  );
}
