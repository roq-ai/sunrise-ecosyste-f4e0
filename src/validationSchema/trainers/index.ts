import * as yup from 'yup';

export const trainerValidationSchema = yup.object().shape({
  availability: yup.string().required(),
  qualifications: yup.string().required(),
  experience: yup.string().required(),
  user_id: yup.string().nullable(),
});
