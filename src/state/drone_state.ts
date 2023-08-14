import { DroneState, type Drone } from '../models/drone';
import type Medication from '../models/medication';

class State {
  private drones: Map<string, Drone>;
  private logs: Map<string, Object[]>;
  private static instance: State;

  private constructor() {
    this.drones = new Map();
    this.logs = new Map();
  }

  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  stateChange(id: string, newState: DroneState) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    drone.state = newState;

    return {
      success: true,
      message: "Drone's state successfuly changed",
    };
  }

  getState(id: string) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    return {
      success: true,
      message: '',
      state: drone.state,
    };
  }

  registerDrone(droneData: Drone) {
    if (this.drones.has(droneData.serialNumber)) {
      return {
        success: false,
        message: 'Drone already registered',
      };
    }

    const data = { ...droneData, state: DroneState.IDLE, medications: [] };

    this.drones.set(droneData.serialNumber, data);

    return {
      success: true,
      message: 'Drone successfuly registered',
    };
  }

  getAvailables() {
    const availables: Drone[] = [];

    this.drones.forEach((drone) => {
      if (this.getState(drone.serialNumber)?.state === DroneState.IDLE) {
        availables.push(drone);
      }
    });

    return {
      success: true,
      message: '',
      availables,
    };
  }

  load(id: string, medications: Medication[]) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    if (drone.batteryCapacity < 25) {
      return {
        success: false,
        message: 'Battery charge level is less than 25%',
      };
    }

    const totalWeight = medications.reduce((acc, cur) => acc + cur.weight, 0);

    if (totalWeight > drone.weightLimit) {
      return {
        success: false,
        message: 'The total weight of the medications exceeds the load limit of the drone',
      };
    }

    drone.medications = medications;

    return {
      success: true,
      message: 'Drone successfuly loaded',
    };
  }

  getBatteryLevel(id: string) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    return {
      success: true,
      message: '',
      batteryLevel: drone.batteryCapacity,
    };
  }

  setBatteryLevel(id: string, level: number) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    drone.batteryCapacity = level;

    if (!this.logs.has(id)) {
      this.logs.set(id, []);
    }

    const timestamp = new Date().toISOString();

    this.logs.get(id)?.push({ timestamp, batteryCapacity: level });

    return {
      success: true,
      message: '',
    };
  }

  getLoadedMedications(id: string) {
    const drone = this.drones.get(id);

    if (!drone) {
      return {
        success: false,
        message: 'Drone is not registered',
      };
    }

    return {
      success: true,
      message: '',
      loadedMedications: drone.medications,
    };
  }

  getAll() {
    return {
      success: true,
      message: '',
      drones: this.drones,
    };
  }

  getLogs() {
    return {
      success: true,
      message: '',
      logs: this.logs,
    };
  }

  saveStateInDb() {
    // Logic for persisting data in databases...
  }

  restoreStateFromDb() {
    // Logic for importing data from the database...
  }
}

export default State;
