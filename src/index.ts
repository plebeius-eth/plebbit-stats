import express from 'express';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { getStats } from './controllers/stats-controller.js';
import { updateStatsCache } from './services/plebbit.service.js';

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());

app.get('/api/stats', getStats);

async function startServer() {
  try {
    await updateStatsCache();

    // add paths to ssl key and certificate to .env file
    const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH, 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, app).listen(port, () => {
      console.log(`HTTPS Server running on https://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

const port = process.env.PORT || 3000;
startServer();
