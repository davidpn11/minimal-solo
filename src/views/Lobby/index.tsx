import React, { useState } from "react";
import { RoomSelectWrapper, Title, RoomInput, SubmitRoom } from "./styles";
import { requestCreateSession } from "../../api/db/session";

export default function Lobby() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);
  // const [name, setName] = useState('')
  return (
    <RoomSelectWrapper>
      <Title>JOIN A ROOM</Title>
      <RoomInput placeholder="Room code" value={code} onChange={changeCode} />
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <SubmitRoom>JOIN</SubmitRoom>
      <h2>OR CREATE A NEW ONE</h2>
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <SubmitRoom>CREATE</SubmitRoom>
    </RoomSelectWrapper>
  );
}
