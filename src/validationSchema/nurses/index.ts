import * as yup from 'yup';

export const nurseValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  contact_number: yup.string().required(),
  working_hours: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
