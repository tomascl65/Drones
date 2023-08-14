import type { Request, Response } from 'express';

import { DroneState, type Drone } from '../models/drone';
import type Medication from '../models/medication';
import State from '../state/drone_state';

const state = State.getInstance();

class DroneController {
  register(req: Request, res: Response) {
    const { serialNumber, model, weightLimit, batteryCapacity }: Drone = req.body;

    const response = state.registerDrone({
      serialNumber,
      model,
      weightLimit,
      batteryCapacity,
    });

    res.status(response.success ? 201 : 200).json({ message: response.message });
  }

  load(req: Request, res: Response) {
    const [drone] = state.getAvailables()?.availables ?? [];

    if (!drone) {
      return res.status(404).json({
        success: false,
        message: 'There is not available drones',
      });
    }

    const { medications }: { medications: Medication[] } = req.body ?? { medications: [] };
    const id = drone.serialNumber;

    state.stateChange(id, DroneState.LOADING);

    const resp = state.load(id, medications);

    if (resp.success) {
      state.stateChange(id, DroneState.LOADED);
    } else {
      state.stateChange(id, DroneState.IDLE);
    }

    res.status(resp.success ? 200 : 400).json({ message: resp.message });
  }

  checkLoadedMedications(req: Request, res: Response) {
    const { id } = req.params;
    const resp = state.getLoadedMedications(id);

    if (resp.success) {
      res.status(200).json({ loadedMedications: resp.loadedMedications });
    } else {
      res.status(404).json({ message: resp.message });
    }
  }

  checkAvailableDrones(req: Request, res: Response) {
    const response = state.getAvailables();

    res.status(response.availables.length ? 200 : 404).json({ availables: response.availables });
  }

  checkBatteryLevel(req: Request, res: Response) {
    const { id } = req.params;
    const resp = state.getBatteryLevel(id);

    if (resp.success) {
      res.status(200).json({ batteryLevel: resp.batteryLevel });
    } else {
      res.status(404).json({ message: resp.message });
    }
  }

  getLogs(req: Request, res: Response) {
    const resp = state.getLogs();

    if (resp.logs.size) {
      res.status(200).json(JSON.parse(JSON.stringify(Object.fromEntries(resp.logs))));
    } else {
      res.status(404).json({ message: 'The log is empty' });
    }
  }
}

export default DroneController;
