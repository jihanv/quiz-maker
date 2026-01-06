import { zipfFrequency } from "nodewordfreq";

export function getZipf(word: string): number {
  const z = zipfFrequency(word, "en");
  console.log("Frequency is " + z);
  return Number.isFinite(z) ? z : 10; // unknown => treat as very common/easy
}
