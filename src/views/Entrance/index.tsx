import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { CardWrapper, Title, Page } from "./styles";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";
import {
  createGameSession,
  joinGameSession,
  clearSession,
  JoinGameSessionReturn,
} from "../../store/session/actions";
import { setPlayer } from "../../store/playerHand/actions";
import { ReduxThunkDispatch } from "../../store/rootReducer";
import { LocalSessionWithId } from "../../model/Session";

const BASE_ERROR_STATE = {
  status: false,
  message: "",
};

export default function Entrance() {
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  // TODO: Actual error handling
  const [roomError, setRoomError] = useState(BASE_ERROR_STATE);
  const [nameError, setNameError] = useState(BASE_ERROR_STATE);
  const [adminNameError, setAdminNameError] = useState(BASE_ERROR_STATE);
  const [code, setCode] = useState("");
  const dispatch = useDispatch<ReduxThunkDispatch>();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeAdminName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAdminName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  useEffect(() => {
    dispatch(clearSession());
  }, [dispatch]);

  const createRoom = async () => {
    if (adminName.length === 0) {
      return setAdminNameError({
        status: true,
        message: "Please input your name.",
      });
    }
    setAdminNameError(BASE_ERROR_STATE);

    //TODO pass sessionID to path
    return pipe(
      await dispatch(createGameSession(adminName)),
      E.fold<any, LocalSessionWithId, void>(
        () => {},
        async (session) => {
          await dispatch(setPlayer({ id: session.admin, hand: {} }));
          history.push(`/room/${session.code}`);
        }
      )
    );
  };

  const getRoom = async () => {
    if (name.length === 0) {
      return setNameError({
        status: true,
        message: "Please input your name.",
      });
    }
    setNameError(BASE_ERROR_STATE);
    setRoomError(BASE_ERROR_STATE);

    return pipe(
      await dispatch(joinGameSession(code, name)),
      E.fold<any, JoinGameSessionReturn, void>(
        () => {
          setRoomError({
            status: true,
            message: "Couldn't find this room. Please check it's name.",
          });
        },
        async ({ player, session }) => {
          await dispatch(setPlayer({ id: player.id, hand: {} }));
          history.push(`/room/${session.code}`);
        }
      )
    );
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
          autoComplete="off"
          error={roomError.status}
          helperText={roomError.message}
        />
        <TextField
          name="YourName"
          variant="outlined"
          fullWidth
          label="Your name"
          value={name}
          onChange={changeName}
          required
          autoComplete="off"
          error={nameError.status}
          helperText={nameError.message}
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
          autoComplete="off"
          error={adminNameError.status}
          helperText={adminNameError.message}
        />
        <Button onClick={createRoom} variant="secondary">
          CREATE
        </Button>
      </CardWrapper>
    </Page>
  );
}
