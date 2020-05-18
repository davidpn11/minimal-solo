import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as Yup from 'yup';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import { Backdrop, ModalCard, ModalWrapper, ModalContent, ModalFooter, ModalTitle } from './styles';
import { ReduxThunkDispatch } from '../../../../store/rootReducer';
import { getAllPlayers } from '../../../../store/session/selectors';
import { getPlayerIdValue } from '../../../../store/playerHand/selector';
import { joinGameSession } from '../../../../store/session/actions';
import { TextField } from '../../../../components/TextField';
import { Button } from '../../../../components/Button';
import { unitJSX } from '../../../../utils/unit';
import { safeSetItem } from '../../../../utils/storage';
import { LocalSessionWithId } from '../../../../model/Session';

const INITIAL_VALUES = {
  userName: '',
};

type Fields = typeof INITIAL_VALUES;

const validationSchema = Yup.object<Fields>({
  userName: Yup.string().required('Please input your name.'),
});

export function JoinModal() {
  const history = useHistory();
  const match = useRouteMatch<{ code: string }>();
  const players = useSelector(getAllPlayers);
  const currentPlayerId = useSelector(getPlayerIdValue);
  const isPlaying = Object.keys(players).some(playerId => playerId === currentPlayerId);
  const dispatch = useDispatch<ReduxThunkDispatch>();

  if (isPlaying || !match.params.code) {
    return unitJSX;
  }

  async function joinRoom({ userName }: Fields, formikHelpers: FormikHelpers<Fields>) {
    return pipe(
      await dispatch(joinGameSession(match.params.code, userName, currentPlayerId)),
      E.fold<any, LocalSessionWithId, void>(
        () =>
          formikHelpers.setFieldError(
            'userName',
            'Something went wrong while trying to join the room.',
          ),
        session => {
          safeSetItem('sessionId', session.id);
        },
      ),
    );
  }

  return (
    <ModalWrapper>
      <Backdrop />
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        onSubmit={joinRoom}
      >
        <ModalCard>
          <Form>
            <ModalTitle>Do you want to join this room?</ModalTitle>
            <ModalContent>
              <Field
                component={TextField}
                name="userName"
                label="Your Name"
                fullWidth
                autoComplete="off"
                required
              />
            </ModalContent>
            <ModalFooter>
              <Button variant="cancel" onClick={() => history.push('/')}>
                Cancel
              </Button>
              <Button type="submit">Join</Button>
            </ModalFooter>
          </Form>
        </ModalCard>
      </Formik>
    </ModalWrapper>
  );
}
