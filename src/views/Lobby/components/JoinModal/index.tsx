import React from 'react';
import { useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';

import { Backdrop, ModalCard, ModalWrapper, ModalContent, ModalFooter, ModalTitle } from './styles';
import { getAllPlayers } from '../../../../store/session/selectors';
import { getPlayerId } from '../../../../store/playerHand/selector';
import { TextField } from '../../../../components/TextField';
import { Button } from '../../../../components/Button';
import { unitJSX } from '../../../../utils/unit';

export function JoinModal() {
  const history = useHistory();
  const players = useSelector(getAllPlayers);
  const currentPlayerId = useSelector(getPlayerId);
  const isPlaying = Object.keys(players).some(playerId => playerId === currentPlayerId);

  if (isPlaying) {
    return unitJSX;
  }

  return (
    <ModalWrapper>
      <Backdrop />
      <Formik initialValues={{ yourName: '' }} onSubmit={() => {}}>
        <ModalCard>
          <ModalTitle>Do you want to join this room?</ModalTitle>
          <ModalContent>
            <Form>
              <Field
                component={TextField}
                name="playerName"
                label="Your Name"
                fullWidth
                autoComplete="off"
                required
              />
            </Form>
          </ModalContent>
          <ModalFooter>
            <Button variant="cancel" onClick={() => history.push('/')}>
              Cancel
            </Button>
            <Button>Join</Button>
          </ModalFooter>
        </ModalCard>
      </Formik>
    </ModalWrapper>
  );
}
