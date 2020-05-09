import React from 'react';
import * as Yup from 'yup';
import { Formik, Field, FormikHelpers, Form } from 'formik';

import { Title } from '../styles';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/FormikTextField';

export type CreateFields = {
  adminName: string;
};

const INITIAL_VALUES: CreateFields = {
  adminName: '',
};

const validationSchema = Yup.object<CreateFields>({
  adminName: Yup.string().required('Please input your name.'),
});

type Props = {
  onSubmit: (fields: CreateFields, formikHelpers: FormikHelpers<CreateFields>) => void;
};

export function CreateRoomForm(props: Props) {
  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={validationSchema} onSubmit={props.onSubmit}>
      <Form>
        <Title>Create a new Room</Title>
        <Field component={TextField} name="adminName" label="Your name" fullWidth autoComplete="off" required />
        <Button type="submit" variant="secondary">
          CREATE
        </Button>
      </Form>
    </Formik>
  );
}
