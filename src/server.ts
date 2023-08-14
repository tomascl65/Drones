import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

import app from './app';
import Task from './controllers/task_controller';

const port = process.env.PORT || 3000;

// Running a task every minute
cron.schedule('* * * * *', () => new Task().droneBatteryLevels());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.info(`Docs available at http://localhost:${port}/docs`);
});
