// Ad-hoc full-day closures (storms, holidays, etc.), managed from the
// dashboard instead of a hardcoded list in the reservation form. Same dual
// backend as src/lib/reservations.ts: Upstash Redis when configured, a local
// JSON file otherwise.

import { promises as fs } from "fs";
import path from "path";
import { redisClient } from "@/lib/redis";

const REDIS_KEY = "closures:v1";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "closures.json");

async function readAllFile(): Promise<string[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

async function writeAllFile(list: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

async function readAll(): Promise<string[]> {
  const redis = redisClient();
  if (!redis) return readAllFile();
  const list = await redis.get<string[]>(REDIS_KEY);
  return list ?? [];
}

async function writeAll(list: string[]): Promise<void> {
  const redis = redisClient();
  if (!redis) return writeAllFile(list);
  await redis.set(REDIS_KEY, list);
}

export async function listClosures(): Promise<string[]> {
  const list = await readAll();
  return list.sort();
}

export async function addClosure(date: string): Promise<string[]> {
  const list = await readAll();
  if (!list.includes(date)) list.push(date);
  await writeAll(list);
  return list.sort();
}

export async function removeClosure(date: string): Promise<string[]> {
  const list = (await readAll()).filter((d) => d !== date);
  await writeAll(list);
  return list;
}
