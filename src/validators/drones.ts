import { body } from 'express-validator';

import { DroneModel } from '../models/drone';

export default [
  body('serialNumber', 'Invalid serial number')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 5, max: 100 }),
  body('model', 'Invalid model type')
    .trim()
    .customSanitizer((value) => {
      return value.toUpperCase();
    })
    .isIn(Object.values(DroneModel)),
  body('weightLimit', 'Invalid weight limit')
    .isNumeric()
    .custom((value) => {
      return value >= 0 && value <= 500;
    }),
  body('batteryCapacity', 'Invalid battery level')
    .isNumeric()
    .custom((value) => {
      return value >= 0 && value <= 100;
    }),
];
