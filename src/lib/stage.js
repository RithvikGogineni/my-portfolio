// Stage constants and the projection→percentage helper. Kept out of the
// component file so the orbit module exports components only and Fast Refresh
// keeps working on it.
export const VIEWBOX = 200;   // every stage is −100…100 in both axes
export const toPct = (v) => ((v + VIEWBOX / 2) / VIEWBOX) * 100;
