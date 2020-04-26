import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Button";
import {
  createGameSession,
  joinGameSession,
} from "../../store/session/actions";
import { RoomInput, CardWrapper, Title, Page } from "./styles";
import { Logo } from "../../components/Logo";

export default function Entrance() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = async () => {
    //TODO pass sessionID to path
    await dispatch(createGameSession(name));
    history.push("/lobby");
  };

  const getRoom = async () => {
    //TODO: CHECK if session Creation was sucessful - Type Issue
    const result = await dispatch(joinGameSession(code, name));
    console.log({ result });
    history.push("/lobby");
  };

  return (
    <Page>
      <CardWrapper>
        <Logo variant="COLOR" />
        <Title>Join an existing Room</Title>
        <RoomInput placeholder="Room code" value={code} onChange={changeCode} />
        <RoomInput placeholder="Your name" value={name} onChange={changeName} />
        <Button onClick={getRoom}>JOIN</Button>
        <Title>Create a new Room</Title>
        <RoomInput placeholder="Your name" value={name} onChange={changeName} />
        <Button onClick={createRoom} variant="secondary">
          CREATE
        </Button>
      </CardWrapper>
    </Page>
  );
}
