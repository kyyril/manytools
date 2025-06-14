import { get, set, del } from "idb-keyval";

export interface MakalahStructure {
  id: string;
  judul: string;
  topik: string;
  abstrak: string;
  bab: Chapter[];
  referensi: string;
  lastCheckpoint: string;
}

export interface Chapter {
  title: string;
  sub: SubChapter[];
}

export interface SubChapter {
  title: string;
  content: string;
  generated: boolean;
}

const CHECKPOINT_STORE_KEY = "makalah_checkpoints";

export async function saveCheckpoint(makalah: MakalahStructure): Promise<void> {
  let checkpoints = (await get<MakalahStructure[]>(CHECKPOINT_STORE_KEY)) || [];
  const existingIndex = checkpoints.findIndex(
    (m: MakalahStructure) => m.id === makalah.id
  );

  if (existingIndex > -1) {
    checkpoints[existingIndex] = makalah;
  } else {
    checkpoints.push(makalah);
  }
  await set(CHECKPOINT_STORE_KEY, checkpoints);
  console.log(`Checkpoint saved for ${makalah.id}`);
}

export async function loadCheckpoint(
  id: string
): Promise<MakalahStructure | undefined> {
  const checkpoints =
    (await get<MakalahStructure[]>(CHECKPOINT_STORE_KEY)) || [];
  return checkpoints.find((m: MakalahStructure) => m.id === id);
}

export async function getAllCheckpoints(): Promise<MakalahStructure[]> {
  return (await get<MakalahStructure[]>(CHECKPOINT_STORE_KEY)) || [];
}

export async function deleteCheckpoint(id: string): Promise<void> {
  let checkpoints = (await get<MakalahStructure[]>(CHECKPOINT_STORE_KEY)) || [];
  checkpoints = checkpoints.filter((m: MakalahStructure) => m.id !== id);
  await set(CHECKPOINT_STORE_KEY, checkpoints);
  console.log(`Checkpoint deleted for ${id}`);
}
