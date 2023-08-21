import * as yup from 'yup';

export const vehicleValidationSchema = yup.object().shape({
  make: yup.string().required(),
  model: yup.string().required(),
  year: yup.number().integer().required(),
  mileage: yup.number().integer().required(),
  color: yup.string().required(),
  owner_id: yup.string().nullable().required(),
});
