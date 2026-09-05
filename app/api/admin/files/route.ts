import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { addLocalExternalFile } from '@/lib/localFiles';

const MAX = 500 * 1024 * 1024;
const allowed = ['application/zip', 'application/x-zip-compressed', 'application/pdf', 'text/plain', 'application/octet-stream', 'image/png', 'image/jpeg', 'image/webp'];
const linkSchema = z.string().url().refine((value) => value.startsWith('https://'), 'Only HTTPS links are allowed.');

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const supabase = await serverSupabase();
  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  const category = String(form.get('category') || 'Other');
  const description = String(form.get('description') || '');
  const externalUrl = String(form.get('external_url') || '').trim();
  const file = form.get('file');

  if (!supabase) {
    const parsedUrl = linkSchema.safeParse(externalUrl);
    if (!parsedUrl.success) return NextResponse.json({ message: 'Local mode supports HTTPS MediaFire links only.' }, { status: 400 });
    if (!name) return NextResponse.json({ message: 'A file name is required.' }, { status: 400 });
    const localFile = await addLocalExternalFile({ name, category, description, externalUrl });
    return NextResponse.json({ message: 'External download added in local mode.', file: localFile });
  }

  if (externalUrl) {
    const parsedUrl = linkSchema.safeParse(externalUrl);
    if (!parsedUrl.success) return NextResponse.json({ message: 'Enter a valid HTTPS download link.' }, { status: 400 });
    if (!name) return NextResponse.json({ message: 'A file name is required.' }, { status: 400 });
    const result = await supabase.from('files').insert({ name, slug: `${crypto.randomUUID()}-external`, description, category, mime_type: 'external/link', size_bytes: 0, storage_path: null, external_url: externalUrl, tags: [], downloads: 0, is_public: true }).select().single();
    if (result.error) return NextResponse.json({ message: result.error.message }, { status: 500 });
    return NextResponse.json({ message: 'External download added.', file: result.data });
  }

  if (!(file instanceof File)) return NextResponse.json({ message: 'Add a MediaFire link or choose a file.' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ message: 'File too large (500MB max).' }, { status: 400 });
  if (file.type && !allowed.includes(file.type)) return NextResponse.json({ message: 'File type not allowed.' }, { status: 400 });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 150);
  const path = `${crypto.randomUUID()}-${safe}`;
  const upload = await supabase.storage.from('files').upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });
  if (upload.error) return NextResponse.json({ message: upload.error.message }, { status: 500 });
  const result = await supabase.from('files').insert({ name: name || safe, slug: path, description, category, mime_type: file.type || 'application/octet-stream', size_bytes: file.size, storage_path: path, external_url: null, tags: [], downloads: 0, is_public: true }).select().single();
  if (result.error) { await supabase.storage.from('files').remove([path]); return NextResponse.json({ message: result.error.message }, { status: 500 }); }
  return NextResponse.json({ message: 'File uploaded.', file: result.data });
}
