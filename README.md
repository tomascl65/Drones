# Drones

This is a REST API that allows clients to communicate with the drones (i.e. **dispatch controller**). The specific communication with the drone is outside the scope of this project.

## Technologies Used

- Node.js
- TypeScript
- Express
- Jest
- Swagger

## Installation

1. Install Node.js from [nodejs.org](https://nodejs.org).
2. Clone the project repository: `git clone <repository-url>`.
3. Navigate to the project directory: `cd <project-folder>`.
4. Install project dependencies: `npm install`.

## Configuration

1. Create a configuration file: `.env`.
2. Set up the environment variables in the configuration file:
   PORT=3000

## Running the Project

1. Start the project locally: `npm start`.
2. Access the API endpoints at `http://localhost:3000`.

## API Endpoints

- `POST /drones`: Register a drone.
- `POST /drones/load`: Find an available drone and load it with medication items.
- `GET /drones/medications/:id`: Check loaded medication items for a given drone.
- `GET /drones/available`: Check available drones for loading.
- `GET /drones/battery/:id`: Check drone battery level for a given drone.
- `GET /drones/logs`: Check battery level history.

For detailed information on request/response formats and required parameters, refer to the API documentation at `http://localhost:3000/docs`.

## Running Tests

1. Run tests: `npm test`.
