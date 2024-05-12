import express from 'express';
import { getStats } from './controllers/stats-controller.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/stats', getStats);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
