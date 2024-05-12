import Plebbit from '@plebbit/plebbit-js';
import { SubplebbitType as Subplebbit } from '@plebbit/plebbit-js/dist/node/subplebbit/types.js';
import { getDefaultSubplebbitsAddresses } from '../utils/get-default-subplebbits.js';

const plebbit = await Plebbit({
  ipfsGatewayUrls: [
      "https://ipfs.io",
      "https://ipfsgateway.xyz",
      "https://cloudflare-ipfs.com",
      "https://gateway.plebpubsub.xyz",
      "https://4everland.io"
  ],
  pubsubHttpClientsOptions: [
      "https://pubsubprovider.xyz/api/v0",
      "https://plebpubsub.xyz/api/v0",
      "https://rannithepleb.com/api/v0"
  ],
});

let statsCache = {};
let isCacheReady = false;

async function updateStatsCache() {
  console.log("Updating stats cache...");
  try {
    const subplebbitAddresses = await getDefaultSubplebbitsAddresses();
    if (!subplebbitAddresses || subplebbitAddresses.length === 0) {
      console.error('No subplebbit addresses found or failed to fetch.');
      return;
    }

    const statsPromises = subplebbitAddresses.map(address => fetchSubplebbitStats(address));
    const statsResults = await Promise.all(statsPromises);

    const newStatsObject = statsResults.reduce((acc: any, stats, index) => {
      if (stats) {
        acc[subplebbitAddresses[index]] = stats;
      }
      return acc;
    }, {});

    statsCache = newStatsObject;
    isCacheReady = true;
    console.log("Stats cache updated successfully.");
  } catch (error) {
    console.error('Failed to update stats cache:', error);
  }
}

updateStatsCache();
setInterval(updateStatsCache, 30000);

export function getCachedStats() {
  if (!isCacheReady) {
    throw new Error('Stats are currently updating. Please try again shortly.');
  }
  return statsCache;
}

export async function fetchSubplebbitStats(subplebbitAddress: string) {
  try {
    const subplebbit = await plebbit.getSubplebbit(subplebbitAddress) as Subplebbit;
    if (!subplebbit) {
        console.error('No subplebbit found with address:', subplebbitAddress);
        return null;
    } else if (!subplebbit.statsCid) {
      console.error('No statsCid found for subplebbit with address:', subplebbitAddress);
      return null;
    }
    
    const statsJson = await plebbit.fetchCid(subplebbit.statsCid);
    const stats = JSON.parse(statsJson);
    return { stats };

  } catch (error) {
    console.error('Error fetching subplebbit stats for address:', subplebbitAddress, error);
    return null;
  }
}


export { updateStatsCache };
