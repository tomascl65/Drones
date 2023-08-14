import request from 'supertest';
import app from '../src/app';

describe('POST /drones', () => {
  const newDrone = {
    serialNumber: '54635634563645645645',
    model: 'Middleweight',
    weightLimit: 250,
    batteryCapacity: 100,
  };

  it('Should respond Drone succesfuly registered', async () => {
    const res = await request(app)
      .post('/drones')
      .send(newDrone)
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('Should respond Drone already registered', async () => {
    const res = await request(app)
      .post('/drones')
      .send(newDrone)
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Should respond Invalid serial number', async () => {
    const drone = JSON.parse(JSON.stringify(newDrone));

    drone.serialNumber = '34';

    const res: any = await request(app)
      .post('/drones')
      .send(drone)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ path }: { path: string }) => path === 'serialNumber')?.msg ?? '';

    expect(error).toBe('Invalid serial number');
  });

  it('Should respond Invalid model type', async () => {
    const drone = JSON.parse(JSON.stringify(newDrone));

    drone.serialNumber = '42352435345435345';
    drone.model = '';

    const res: any = await request(app)
      .post('/drones')
      .send(drone)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ path }: { path: string }) => path === 'model')?.msg ?? '';

    expect(error).toBe('Invalid model type');
  });

  it('Should respond Invalid weight limit', async () => {
    const drone = JSON.parse(JSON.stringify(newDrone));

    drone.serialNumber = '9045094859380938';
    drone.weightLimit = -1;

    const res: any = await request(app)
      .post('/drones')
      .send(drone)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ path }: { path: string }) => path === 'weightLimit')?.msg ?? '';

    expect(error).toBe('Invalid weight limit');
  });

  it('Should respond Invalid battery level', async () => {
    const drone = JSON.parse(JSON.stringify(newDrone));

    drone.serialNumber = '45345u455345093';
    drone.batteryCapacity = 101;

    const res: any = await request(app)
      .post('/drones')
      .send(drone)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ path }: { path: string }) => path === 'batteryCapacity')?.msg ?? '';

    expect(error).toBe('Invalid battery level');
  });
});

describe('POST /drones/load', () => {
  const newMedications = {
    medications: [
      {
        name: 'Aspirina',
        weight: 35,
        code: 'ASP_500',
        image: 'RXN0byBlcyB1biBmaWNoZXJvIGVuIHRleHRvIHBsYW5vLgpTb2xvIHNlcnZpcsOhIHBhcmEgY29t',
      },
    ],
  };

  it('Should respond Drone successfuly loaded', async () => {
    const res = await request(app)
      .post('/drones/load')
      .send(newMedications)
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Should respond There is not available drones', async () => {
    const res = await request(app)
      .post('/drones/load')
      .send(newMedications)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('Should respond Invalid medication name', async () => {
    const medications = JSON.parse(JSON.stringify(newMedications));

    medications.medications[0].name = '???';

    const res: any = await request(app)
      .post('/drones/load')
      .send(medications)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ msg }: { msg: string }) => msg === 'Invalid medication name')
        ?.msg ?? '';

    expect(error).toBe('Invalid medication name');
  });

  it('Should respond Invalid medication weight', async () => {
    const medications = JSON.parse(JSON.stringify(newMedications));

    medications.medications[0].weight = -1;

    const res: any = await request(app)
      .post('/drones/load')
      .send(medications)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ msg }: { msg: string }) => msg === 'Invalid medication weight')
        ?.msg ?? '';

    expect(error).toBe('Invalid medication weight');
  });

  it('Should respond Invalid medication code', async () => {
    const medications = JSON.parse(JSON.stringify(newMedications));

    medications.medications[0].code = '';

    const res: any = await request(app)
      .post('/drones/load')
      .send(medications)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ msg }: { msg: string }) => msg === 'Invalid medication code')
        ?.msg ?? '';

    expect(error).toBe('Invalid medication code');
  });

  it('Should respond Invalid medication image', async () => {
    const medications = JSON.parse(JSON.stringify(newMedications));

    medications.medications[0].image = '?';

    const res: any = await request(app)
      .post('/drones/load')
      .send(medications)
      .expect('Content-Type', /json/)
      .expect(400);

    const error =
      res.body?.errors?.find(({ msg }: { msg: string }) => msg === 'Invalid medication image')
        ?.msg ?? '';

    expect(error).toBe('Invalid medication image');
  });
});

describe('GET /drones/medications/:id', () => {
  it('Should respond with an object list of loaded medications', async () => {
    const id = '54635634563645645645';

    const res = await request(app)
      .get(`/drones/medications/${id}`)
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Should respond Drone is not registered', async () => {
    const id = '45';

    const res = await request(app)
      .get(`/drones/medications/${id}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('GET /drones/available', () => {
  it('Should respond with an empty array of available drones', async () => {
    const res = await request(app)
      .get(`/drones/available`)
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('GET /drones/battery/:id', () => {
  const id = '54635634563645645645';

  it('Should respond with a number indicating the battery percent', async () => {
    const res = await request(app)
      .get(`/drones/battery/${id}`)
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Should respond Drone is not registered', async () => {
    const id = '45';

    const res = await request(app)
      .get(`/drones/battery/${id}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('GET /drones/logs', () => {
  it('Should respond with an empty message', async () => {
    const res = await request(app)
      .get(`/drones/logs`)
      .expect('Content-Type', /json/)
      .expect(404);
  });
});
