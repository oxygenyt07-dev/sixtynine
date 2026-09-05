create extension if not exists pgcrypto;
create table if not exists public.files (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, description text, category text not null default 'Other', mime_type text not null default 'external/link', size_bytes bigint not null default 0, storage_path text unique, external_url text, thumbnail_url text, tags text[] not null default '{}', version text, downloads bigint not null default 0, is_public boolean not null default true, created_at timestamptz not null default now()
);
alter table public.files add column if not exists external_url text;
alter table public.files alter column storage_path drop not null;
alter table public.files enable row level security;
create policy "public can read public files" on public.files for select using (is_public=true);
create or replace function public.increment_downloads(file_id uuid) returns void language sql security definer as $$ update public.files set downloads=downloads+1 where id=file_id; $$;
-- Create a private Storage bucket named `files` in Supabase Storage.
-- Recommended Storage policy: allow authenticated admins to INSERT/UPDATE/DELETE; signed URLs are generated server-side.
