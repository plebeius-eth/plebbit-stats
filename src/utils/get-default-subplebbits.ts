import { MultisubSubplebbit } from "src/models/multisub-subplebbit.js";

let cache: MultisubSubplebbit[] | null = null;

export async function getDefaultSubplebbits() {
  if (cache) {
    return cache;
  }
  try {
    const response = await fetch('https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json');
    const multisub = await response.json();
    cache = multisub.subplebbits;
    return cache;
  } catch (e) {
    console.error('Failed to fetch default subplebbits:', e);
    return [];
  }
}
