export const NEXT_PUBLIC_URL = 'https://phi-quest-eligible-frame.vercel.app';
export const ALLOWED_ORIGIN = 'phi-quest-eligible-frame.vercel.app';

export const CARD_DIMENSIONS = {
  width: 800,
  height: 800,
};

export const TOKEN_IMAGE = `${NEXT_PUBLIC_URL}/park-1.png`;

export const PHI_GRAPH = `https://graph-api.phi.blue/graphql`;

export function queryForLand(address: string) {
  return `query philandList { philandList(input: {address: "${address}" transparent: false}) { data { name landurl imageurl } } }`;
}

export function conditionTrigger(address: string) {
  return `mutation conditionTrigger { conditionTrigger(input: {address: "${address}"}) { success }}`;
}

export function queryForClaim(address: string) {
  return `claimedStatus { claimedStatus(input: {address: "${address}", unclaimed: true}) { data status }}`;
}
