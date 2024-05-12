import { Request, Response } from 'express';
import { getCachedStats } from '../services/plebbit.service.js';

export async function getStats(req: Request, res: Response) {
  try {
    const statsObject = getCachedStats();
    if (Object.keys(statsObject).length === 0) {
      throw new Error('Stats are currently updating. Please try again shortly.');
    }
    res.json(statsObject);
  } catch (error) {
    console.error('Failed to serve stats:', error);
    res.status(500).send('Failed to fetch stats');
  }
}
