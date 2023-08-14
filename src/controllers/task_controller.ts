import State from '../state/drone_state';

const state = State.getInstance();

class Task {
  // To avoid overlapping the execution of the task in a real environment
  running = false;

  droneBatteryLevels() {
    if (!this.running) {
      this.running = true;

      state.getAll().drones.forEach(({ serialNumber, batteryCapacity }) => {
        // Comunication logic with the drone to obtain battery capacity
        // ...
  
        // Simulated battery levels
        const batteryLevel = Math.floor(Math.random() * 100);
  
        if (batteryCapacity !== batteryLevel) {
          state.setBatteryLevel(serialNumber, batteryLevel);
        }
      });

      this.running = false;
    }
  }
}

export default Task;
