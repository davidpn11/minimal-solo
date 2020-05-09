import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import React, { useEffect } from 'react';
import { Field, Form, Formik, useFormikContext } from 'formik';

import { TextField } from './index';

function ErrorKnob() {
  const errorKnob = boolean('Error', false);
  const { setFieldError, setFieldTouched, errors } = useFormikContext();

  console.log({ errors, errorKnob });

  useEffect(() => {
    if (errorKnob) {
      setFieldTouched('field', true);
      setFieldError('field', 'Some error message.');
    } else {
      setFieldTouched('field', false);
    }
  }, [errorKnob]);

  return null;
}

export function TextfieldStory() {
  const labelKnob = text('Label', 'Label');
  const disabledKnob = boolean('Disabled', false);

  return (
    <div>
      <Formik initialValues={{ field: '' }} onSubmit={() => {}} validateOnChange={false} validateOnBlur={false}>
        <Form>
          <Field component={TextField} name="field" disabled={disabledKnob} label={labelKnob} />
          <ErrorKnob />
        </Form>
      </Formik>
    </div>
  );
}

export default {
  title: 'MinimalSolo/Components/Base',
  component: TextfieldStory,
  decorators: [withKnobs],
};
