import React from 'react';
import * as Yup from 'yup';
import { Formik, Field, FormikHelpers, Form } from 'formik';

import { Title } from '../styles';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';

export type JoinFields = {
  roomCode: string;
  userName: string;
};

const INITIAL_VALUES: JoinFields = {
  roomCode: '',
  userName: '',
};

const validationSchema = Yup.object<JoinFields>({
  roomCode: Yup.string().required('Please input a valid room code.'),
  userName: Yup.string().required('Please input your name.'),
});

type Props = {
  onSubmit: (fields: JoinFields, formikHelpers: FormikHelpers<JoinFields>) => void;
};

export function JoinRoomForm(props: Props) {
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
    >
      <Form>
        <Title>Join an existing Room</Title>
        <Field
          component={TextField}
          name="roomCode"
          label="Room Code"
          fullWidth
          autoComplete="off"
          required
        />
        <Field
          component={TextField}
          name="userName"
          label="Your name"
          fullWidth
          autoComplete="off"
          required
        />
        <Button type="submit">JOIN</Button>
      </Form>
    </Formik>
  );
}
