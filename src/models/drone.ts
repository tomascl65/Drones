import type Medication from './medication';

export enum DroneState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING',
}

export enum DroneModel {
  LIGHTWEIGHT = 'LIGHTWEIGHT',
  MIDDLEWEIGHT = 'MIDDLEWEIGHT',
  CRUISERWEIGHT = 'CRUISERWEIGHT',
  HEAVYWEIGHT = 'HEAVYWEIGHT',
}

export interface Drone {
  serialNumber: string;
  model: DroneModel;
  weightLimit: number;
  batteryCapacity: number;
  state?: DroneState;
  medications?: Medication[];
}
