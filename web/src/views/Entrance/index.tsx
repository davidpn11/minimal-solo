import React, { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { FormikHelpers } from 'formik';

import { CardWrapper, Page } from './styles';
import { JoinFields, JoinRoomForm } from './components/JoinRoomForm';
import { CreateFields, CreateRoomForm } from './components/CreateRoomForm';
import { Logo } from '../../components/Logo';
import { safeClearItem, safeSetItem } from '../../utils/storage';
import { ReduxThunkDispatch } from '../../store/rootReducer';
import { getPlayerIdValue } from '../../store/playerHand/selector';
import { setPlayerId } from '../../store/playerHand/actions';
import { createGameSession, joinGameSession, clearSession } from '../../store/session/actions';

export default function Entrance() {
  const dispatch = useDispatch<ReduxThunkDispatch>();
  const history = useHistory();
  const playerId = useSelector(getPlayerIdValue);

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

  async function createRoom(
    { adminName }: CreateFields,
    formikHelpers: FormikHelpers<CreateFields>,
  ) {
    return pipe(
      await dispatch(createGameSession(adminName, playerId)),
      E.fold<any, LocalSessionWithId, void>(
        () =>
          formikHelpers.setFieldError(
            'adminName',
            'There was an error trying to create a room. Please try again.',
          ),
        joinSession,
      ),
    );
  }

  async function joinRoom(
    { roomCode, userName }: JoinFields,
    formikHelpers: FormikHelpers<JoinFields>,
  ) {
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
