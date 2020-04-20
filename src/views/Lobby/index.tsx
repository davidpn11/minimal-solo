import React, { useState } from "react";
import { RoomSelectWrapper, Title, RoomInput } from "./styles";
import { Button } from "../../components/Button";
import { useDispatch } from "react-redux";
import { createGameSession } from "../../store/actions";

export default function Lobby() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = async () => {
    console.log("creating");
    dispatch(createGameSession(name));
  };

  return (
    <RoomSelectWrapper>
      <Title>JOIN A ROOM</Title>
      <RoomInput placeholder="Room code" value={code} onChange={changeCode} />
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <Button>JOIN</Button>
      <h2>OR CREATE A NEW ONE</h2>
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <Button variant="secondary">CREATE</Button>
    </RoomSelectWrapper>
  );
}
