import Plebbit from '@plebbit/plebbit-js';
import { SubplebbitType as Subplebbit } from '@plebbit/plebbit-js/dist/node/subplebbit/types.js';

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

export async function fetchSubplebbitStats(subplebbitAddress: string) {
  try {
    const subplebbit = await plebbit.getSubplebbit(subplebbitAddress) as Subplebbit;
    if (!subplebbit) {
        console.log('No subplebbit found with address: ' + subplebbitAddress);
        throw new Error('No subplebbit found with address: ' + subplebbitAddress);
    } else if (!subplebbit.statsCid) {
        console.log('No statsCid found for subplebbit with address: ' + subplebbitAddress);
        throw new Error('No statsCid found for subplebbit with address: ' + subplebbitAddress);
    }
    const stats = await plebbit.fetchCid(subplebbit.statsCid);
    return stats;

  } catch (error) {
    console.error('Error fetching subplebbit:', error);
  }
}
