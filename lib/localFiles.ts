import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { FileItem } from '@/types';

const dataDirectory = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDirectory, 'files.json');

export async function readLocalFiles(): Promise<FileItem[]> {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8')) as FileItem[];
  } catch {
    return [];
  }
}

export async function addLocalExternalFile(input: { name: string; category: string; description: string; externalUrl: string }) {
  const files = await readLocalFiles();
  const file: FileItem = {
    id: crypto.randomUUID(),
    name: input.name,
    slug: `${crypto.randomUUID()}-external`,
    description: input.description || null,
    category: input.category,
    mime_type: 'external/link',
    size_bytes: 0,
    storage_path: null,
    external_url: input.externalUrl,
    thumbnail_url: null,
    tags: [],
    version: null,
    downloads: 0,
    created_at: new Date().toISOString(),
  };
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify([file, ...files], null, 2), 'utf8');
  return file;
}
