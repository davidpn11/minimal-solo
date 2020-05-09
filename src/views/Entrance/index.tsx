import React, { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { FormikHelpers } from 'formik';

import { CardWrapper, Page } from './styles';
import { Logo } from '../../components/Logo';
import { createGameSession, joinGameSession, clearSession } from '../../store/session/actions';
import { ReduxThunkDispatch } from '../../store/rootReducer';
import { LocalSessionWithId } from '../../model/Session';
import { getPlayerId } from '../../store/playerHand/selector';
import { safeClearItem, safeSetItem } from '../../utils/storage';
import { setPlayerId } from '../../store/playerHand/actions';
import { JoinFields, JoinRoomForm } from './components/JoinRoomForm';
import { CreateFields, CreateRoomForm } from './components/CreateRoomForm';

export default function Entrance() {
  const dispatch = useDispatch<ReduxThunkDispatch>();
  const history = useHistory();
  const playerId = useSelector(getPlayerId);

  useEffect(
    function resetState() {
      safeClearItem('sessionId');
      safeSetItem('playerId', playerId);
      batch(() => {
        dispatch(clearSession());
        dispatch(setPlayerId(playerId));
      });
    },
    [dispatch, playerId],
  );

  function joinSession(session: LocalSessionWithId) {
    safeSetItem('sessionId', session.id);
    history.push(`/room/${session.code}`);
  }

  async function createRoom({ adminName }: CreateFields) {
    return pipe(
      await dispatch(createGameSession(adminName, playerId)),
      E.fold<any, LocalSessionWithId, void>(() => {}, joinSession),
    );
  }

  async function joinRoom({ roomCode, userName }: JoinFields, formikHelpers: FormikHelpers<JoinFields>) {
    return pipe(
      await dispatch(joinGameSession(roomCode, userName, playerId)),
      E.fold<any, LocalSessionWithId, void>(
        () => formikHelpers.setFieldError('roomCode', 'Room code not found. Please double check.'),
        joinSession,
      ),
    );
  }

  return (
    <Page>
      <CardWrapper>
        <Logo variant="COLOR" />
        <JoinRoomForm onSubmit={joinRoom} />
        <CreateRoomForm onSubmit={createRoom} />
      </CardWrapper>
    </Page>
  );
}
