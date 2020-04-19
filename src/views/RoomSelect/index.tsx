import React from "react";
import { RoomSelectWrapper, Title, RoomInput, SubmitRoom } from "./styles";
// import { setUser } from "../../api/db/session";

export default function RoomSelect() {
  // setUser();
  return (
    <RoomSelectWrapper>
      <Title>Create or join a room</Title>
      <RoomInput placeholder="Room name" />
      <SubmitRoom>GO!</SubmitRoom>
    </RoomSelectWrapper>
  );
}
