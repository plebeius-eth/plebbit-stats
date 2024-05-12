import express from 'express';
import { getStats } from './controllers/stats-controller.js';
import { updateStatsCache } from './services/plebbit.service.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/stats', getStats);

async function startServer() {
  try {
    await updateStatsCache();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
