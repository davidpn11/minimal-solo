import React from 'react';
import { RoomSelectWrapper, Title, RoomInput, SubmitRoom } from './styles';

export default function RoomSelect() {
  return (
    <RoomSelectWrapper>
      <Title>Create or join a room</Title>
      <RoomInput placeholder="Room name" />
      <SubmitRoom>GO!</SubmitRoom>
    </RoomSelectWrapper>
  );
}
