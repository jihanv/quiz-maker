// lib/server/lexicons.ts
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

const dictJson = JSON.parse(
  fs.readFileSync(path.join(dataDir, "dictionary.json"), "utf8"),
);
export const DICT = new Set<string>(dictJson.dictionary);
