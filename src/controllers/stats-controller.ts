import { Request, Response } from 'express';
import { fetchSubplebbitStats } from '../services/plebbit.service.js';
import { getDefaultSubplebbits } from '../utils/get-default-subplebbits.js';
import { MultisubSubplebbit } from '../models/multisub-subplebbit.js';

export async function getStats(req: Request, res: Response) {
    try {
        const subplebbits = await getDefaultSubplebbits();
        if (!subplebbits) {
            throw new Error('Failed to fetch default subplebbits');
        }
        
        const statsPromises = subplebbits.map(subplebbit => fetchSubplebbitStats(subplebbit.address));
        const statsResults = await Promise.all(statsPromises);
        const statsObject = statsResults.reduce((acc: any, result: any) => {
            if (result) {
                acc[result.address] = result.stats; // Use address as key
            }
            return acc;
        }, {});

        res.json(statsObject); // Send the constructed object

    } catch (error) {
        console.error('Failed to fetch stats:', error);
        res.status(500).send('Failed to fetch stats');
    }
}
