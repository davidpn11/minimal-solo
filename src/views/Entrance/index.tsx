import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import { CardWrapper, Title, Page } from "./styles";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";
import {
  createGameSession,
  joinGameSession,
} from "../../store/session/actions";

export default function Entrance() {
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeAdminName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAdminName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = async () => {
    //TODO pass sessionID to path
    await dispatch(createGameSession(adminName));
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
        <TextField
          name="RoomCode"
          variant="outlined"
          fullWidth
          label="Room Code"
          value={code}
          onChange={changeCode}
          required
        />
        <TextField
          name="YourName"
          variant="outlined"
          fullWidth
          label="Your name"
          value={name}
          onChange={changeName}
          required
        />
        <Button onClick={getRoom}>JOIN</Button>
        <Title>Create a new Room</Title>
        <TextField
          name="AdminName"
          variant="outlined"
          fullWidth
          label="Your name"
          value={adminName}
          onChange={changeAdminName}
          required
        />
        <Button onClick={createRoom} variant="secondary">
          CREATE
        </Button>
      </CardWrapper>
    </Page>
  );
}
