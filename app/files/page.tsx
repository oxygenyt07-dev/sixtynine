import { serverSupabase } from '@/lib/supabase';
import { readLocalFiles } from '@/lib/localFiles';
import FileCard from '@/components/FileCard';
import type { FileItem } from '@/types';

const categories = ['Games', 'Mods', 'Apps', 'Tools', 'Presets', 'Configs', 'Resources', 'Documents', 'Other'];

type SearchParams = { q?: string; category?: string };

export default async function FilesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await serverSupabase();
  return <section className="mx-auto max-w-7xl px-5 py-14 md:py-20"><div className="mb-10 border-b border-white/10 pb-8"><p className="section-label">Resource library / 02</p><h1 className="mt-3 text-5xl font-black md:text-7xl">Downloads.</h1><p className="mt-5 text-zinc-400">Curated files and external downloads, organized for your setup.</p></div>{supabase ? <SupabaseFiles supabase={supabase} searchParams={params} /> : <LocalFiles searchParams={params} />}</section>;
}

function SearchForm({ params }: { params: SearchParams }) {
  return <form className="glass mb-8 grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_220px_auto]"><input name="q" defaultValue={params.q} placeholder="Search files..." className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-[#ffb347]"/><select name="category" defaultValue={params.category || ''} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3"><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><button className="rounded-xl bg-[#ffb347] px-5 py-3 font-bold text-black">Search</button></form>;
}

async function LocalFiles({ searchParams }: { searchParams: SearchParams }) {
  const files = await readLocalFiles();
  const filtered = files.filter((file) => (!searchParams.q || file.name.toLowerCase().includes(searchParams.q.toLowerCase())) && (!searchParams.category || file.category === searchParams.category));
  return <><div className="mb-4 rounded-xl border border-[#ffb347]/20 bg-[#ffb347]/5 p-3 font-sans text-xs uppercase tracking-[.12em] text-[#ffd966]">Local mode · MediaFire links are saved on this computer.</div><SearchForm params={searchParams} />{filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((file) => <FileCard key={file.id} f={file} />)}</div> : <div className="glass rounded-2xl p-12 text-center text-zinc-500">No local files found. Add a MediaFire link from admin.</div>}</>;
}

async function SupabaseFiles({ supabase, searchParams }: { supabase: NonNullable<Awaited<ReturnType<typeof serverSupabase>>>; searchParams: SearchParams }) {
  let query = supabase.from('files').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(60);
  if (searchParams.category) query = query.eq('category', searchParams.category);
  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`);
  const { data, error } = await query;
  return <><SearchForm params={searchParams} />{error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-200">Unable to load files. Check your database setup.</div> : data?.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(data as FileItem[]).map((file) => <FileCard key={file.id} f={file} />)}</div> : <div className="glass rounded-2xl p-12 text-center text-zinc-500">No files found.</div>}</>;
}
