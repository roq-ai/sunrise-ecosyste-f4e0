import * as yup from 'yup';

export const planValidationSchema = yup.object().shape({
  wake_up_time: yup.date().required(),
  walking_route: yup.string().required(),
  meal_plan: yup.string().required(),
  user_id: yup.string().nullable(),
});
