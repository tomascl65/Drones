import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import swaggerUI from 'swagger-ui-express';

import DroneController from './controllers/drone_controller';
import swaggerSpec from './utils/swagger';
import dronesValidator from './validators/drones';
import medicationsValidator from './validators/medications';

const droneController = new DroneController();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateDroneInput:
 *      type: object
 *      required:
 *        - serialNumber
 *        - model
 *        - weightLimit
 *        - batteryCapacity
 *      properties:
 *        serialNumber:
 *          type: string
 *          default: 56546546545345656546456
 *        model:
 *          type: string
 *          default: HEAVYWEIGHT
 *        weightLimit:
 *          type: number
 *          default: 500
 *        batteryCapacity:
 *          type: number
 *          default: 67
 *    MedicationsLoad:
 *      type: array
 *      items:
 *        type: object
 *        required:
 *          - name
 *          - weight
 *          - code
 *          - image
 *        properties:
 *          name:
 *            type: string
 *            default: Benadrilina
 *          weight:
 *            type: number
 *            default: 65
 *          code:
 *            type: string
 *            default: BEN_750
 *          image:
 *            type: string
 *    MessageResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *    ObjectResponse:
 *      type: object
 *      additionalProperties:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            timestamp:
 *              type: string
 *            batteryLevel:
 *              type: number
 *    NumberResponse:
 *      type: object
 *      properties:
 *        batteryLevel:
 *          type: number
 *    ArrayResponse:
 *      type: array
 *      items:
 *        type: object
 *    ErrorResponse:
 *      type: object
 *      properties:
 *        errors:
 *          type: array
 *          items:
 *            type: object
 */

/**
 * @openapi
 * /drones:
 *   post:
 *     tags:
 *     - Drones
 *     summary: Register a drone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDroneInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/drones', dronesValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  droneController.register(req, res);
});

/**
 * @openapi
 * /drones/load:
 *   post:
 *     tags:
 *     - Drone load
 *     summary: Load a drone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicationsLoad'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
app.post('/drones/load', medicationsValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  droneController.load(req, res);
});

/**
 * @openapi
 * /drones/medications/{id}:
 *  get:
 *     tags:
 *     - Check load
 *     summary: Check the load of a drone
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Serial number of the drone
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrayResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
app.get('/drones/medications/:id', droneController.checkLoadedMedications);

/**
 * @openapi
 * /drones/available:
 *  get:
 *     tags:
 *     - Check available drones
 *     summary: Get an array of available drones
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrayResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrayResponse'
 */
app.get('/drones/available', droneController.checkAvailableDrones);

/**
 * @openapi
 * /drones/battery/{id}:
 *   get:
 *     tags:
 *     - Check battery level
 *     summary: Check battery level of a drone
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NumberResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
app.get('/drones/battery/:id', droneController.checkBatteryLevel);

/**
 * @openapi
 * /drones/logs:
 *   get:
 *     tags:
 *     - Get logs
 *     summary: Get battery logs
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
app.get('/drones/logs', droneController.getLogs);

/**
 * Spec for the route /healthcheck
 *
 * @openapi
 * /healthcheck:
 *   get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       "200":
 *         description: App is up and running
 */
app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200); // or res.status(200).send()
});

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Endpoint no found!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ error: 'Something went wrong!' });
});

export default app;
