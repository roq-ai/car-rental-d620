import * as yup from 'yup';

export const performanceValidationSchema = yup.object().shape({
  average_speed: yup.number().integer().required(),
  total_distance: yup.number().integer().required(),
  total_time: yup.number().integer().required(),
  total_reservations: yup.number().integer().required(),
  usage_frequency: yup.number().integer().required(),
  vehicle_id: yup.string().nullable().required(),
});
