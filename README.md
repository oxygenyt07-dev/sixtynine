# SixtyNine

Production-oriented Next.js + Supabase gaming file hub / tools / portfolio starter.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + private Storage
- Server-side signed download URLs
- Admin-only upload API

## 1. Local setup
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## 2. Database
Create a Supabase project. Open SQL Editor and run `supabase.sql`.

## 3. Storage
Create a **private** bucket named `files`. Do not make the bucket public. Configure Storage policies so only your admin/authenticated server workflow can upload/update/delete. Large objects belong in Storage, not PostgreSQL.

## 4. Environment variables
Set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret; reserved for future privileged server operations)
- `ADMIN_EMAIL`

Never commit `.env.local`.

## 5. Admin account
In Supabase Authentication → Users, create the admin user with the same email as `ADMIN_EMAIL`. Set a strong password. The app only permits that email through the admin API.

## 6. Uploads
Go to `/admin`, sign in, then upload a file. The API validates size/type, sanitizes the filename, uploads the object to private Storage, then writes metadata to PostgreSQL. Downloads use short-lived signed URLs.

For a larger production deployment, add resumable uploads (TUS/S3 multipart), virus scanning, MIME sniffing, quotas and an upload job queue.

## 7. Adding tools/projects
- Add tool cards/routes under `app/tools`.
- Add project content under `app/projects`.
- For database-driven tools/projects, create tables and API routes following the `files` pattern.

## 8. Production hardening checklist
- Add middleware/session refresh using the Supabase SSR pattern for your deployed Next.js version.
- Add Redis/Upstash rate limiting to download and auth endpoints.
- Add malware scanning before publishing user-supplied files.
- Enforce a strict allowlist of extensions + MIME/content signatures based on your real file types.
- Add audit logs for admin changes.
- Add pagination/cursor pagination to `/files` as the catalog grows.
- Add CDN/object-storage egress controls and monitoring.
- Add CSP/security headers, backups, monitoring and error tracking.
- Keep the Supabase service-role key server-only.

## Deployment
Deploy the Next.js app to Vercel or another Node-compatible host. Add the environment variables in the host dashboard. Configure Supabase Auth URL/redirect settings for your production domain. Run `npm run build` before deployment.
