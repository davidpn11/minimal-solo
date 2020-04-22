import React, { useState } from "react";
import { RoomSelectWrapper, Title, RoomInput } from "./styles";
import { Button } from "../../components/Button";
import { useDispatch } from "react-redux";
import { createGameSession } from "../../store/actions";
import { useHistory } from "react-router-dom";

export default function Entrance() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = () => {
    console.log("creating");
    const sessionId = dispatch(createGameSession(name));

    console.log(sessionId);
    history.push("/lobby");
  };

  return (
    <RoomSelectWrapper>
      <Title>JOIN A ROOM</Title>
      <RoomInput placeholder="Room code" value={code} onChange={changeCode} />
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <Button>JOIN</Button>
      <h2>OR CREATE A NEW ONE</h2>
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <button onClick={createRoom}>MICHEL VIADO</button>
      <Button variant="secondary">CREATE</Button>
    </RoomSelectWrapper>
  );
}
