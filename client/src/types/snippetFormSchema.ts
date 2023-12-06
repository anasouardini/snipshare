import * as yup from 'yup';

const snippetFormSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup
    .string()
    .oneOf(['text', 'heading', 'list']) //todo: dynamically, get list of existing types
    .required('Type is required!'),
  order: yup.number().min(1).required(),
  color: yup.string().default('black'),
  spacing: yup.number().min(1).max(4).required('Spacing is required!'),
  value: yup.string().required(),
});
export { snippetFormSchema };
