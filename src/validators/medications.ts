import { body } from 'express-validator';

export default [
  body('medications.*.name', 'Invalid medication name')
    .trim()
    .matches(/^[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9_-]+$/),
  body('medications.*.weight', 'Invalid medication weight')
    .isNumeric()
    .custom((value) => {
      return value > 0;
    }),
  body('medications.*.code', 'Invalid medication code')
    .trim()
    .matches(/^[A-ZÁÉÍÓÚÜÑ0-9_]+$/),
  body('medications.*.image', 'Invalid medication image')
    .isBase64(),
];
