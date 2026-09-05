'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown, Database, FileText, Globe2, Headphones, KeyRound, Link2, Lock, ShieldCheck, Tag, Upload, X } from 'lucide-react';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [burst, setBurst] = useState<{ x: number; y: number; hue: number } | null>(null);

  useEffect(() => {
    const move = (event: MouseEvent) => setLight({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  function showBurst(event: React.MouseEvent) {
    setBurst({ x: event.clientX, y: event.clientY, hue: Math.floor(Math.random() * 360) });
    window.setTimeout(() => setBurst(null), 800);
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    setMsg((await response.json()).message);
  }

  async function submitResource(event: React.FormEvent) {
    event.preventDefault();
    const form = new FormData();
    form.append('name', name || file?.name || '');
    form.append('category', 'Other');
    form.append('description', '');
    if (externalUrl) form.append('external_url', externalUrl); else if (file) form.append('file', file);
    const response = await fetch('/api/admin/files', { method: 'POST', body: form });
    setMsg((await response.json()).message);
  }

  function clearResource() {
    setName('');
    setExternalUrl('');
    setFile(null);
    setMsg('');
  }

  return <main className="admin-shell" style={{ '--admin-x': `${light.x}%`, '--admin-y': `${light.y}%` } as React.CSSProperties} onClick={showBurst}>
    <div className="admin-mouse-light" aria-hidden="true" />
    {burst && <span className="admin-click-burst" style={{ left: burst.x, top: burst.y, background: `radial-gradient(circle, hsl(${burst.hue} 90% 70%), transparent 78%)` }} />}
    <section className="admin-card">
      <header className="admin-header"><h1><Crown /> Control Room</h1><span><Lock /> Manage · Publish</span></header>
      <form className="admin-section-card" onSubmit={login}>
        <h2><KeyRound /> Admin Sign In</h2>
        <p className="admin-helper"><ShieldCheck /> Authenticate to unlock publishing tools.</p>
        <div className="admin-form-group"><label htmlFor="admin-username"><Globe2 /> User</label><input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="user 1" required /></div>
        <div className="admin-form-group"><label htmlFor="admin-password"><Lock /> Password</label><input id="admin-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="pass 1" required /></div>
        <div className="admin-action-row"><button className="admin-btn-primary" type="submit"><ArrowRight /> Continue</button><small>Secure · 256-bit</small></div>
      </form>
      <form className="admin-section-card" onSubmit={submitResource}>
        <h2><Upload /> Publish Resource</h2>
        <p className="admin-helper"><Link2 /> Add external link or upload private file.</p>
        <div className="admin-form-group"><label htmlFor="resource-name"><Tag /> Resource Name</label><input id="resource-name" value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="e.g. PC Cleaner" /></div>
        <div className="admin-form-group"><label htmlFor="resource-url"><Globe2 /> External URL</label><input id="resource-url" value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} type="url" placeholder="https://www.mediafire.com/..." /></div>
        <div className="admin-form-group"><label htmlFor="resource-file"><FileText /> Or Choose A Local File</label><div className="admin-file-picker"><label className="admin-file-btn" htmlFor="resource-file"><Upload /> Choose file</label><input id="resource-file" onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" /><span><FileText /> {file?.name || 'No file chosen'}</span></div></div>
        <div className="admin-action-row"><button className="admin-btn-primary" type="submit"><Upload /> Publish Resource</button><button className="admin-btn-secondary" type="button" onClick={clearResource}><X /> Cancel</button></div>
      </form>
      <div className="admin-status-row"><span className="admin-status"><Database /> {msg || 'Supabase status depends on your environment'}</span><span className="admin-local-mode"><Database /> {msg ? 'Response received' : 'Local mode'}</span></div>
      <footer className="admin-footer"><span>© 2026 SixtyNine. Built for gamers &amp; creators.</span><a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer"><Headphones /> Discord</a></footer>
    </section>
  </main>;
}
