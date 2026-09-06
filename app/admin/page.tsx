'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown, Database, FileText, Globe2, Headphones, KeyRound, Link2, Lock, ShieldCheck, Tag, Upload, X, BarChart3 } from 'lucide-react';
type AnalyticsEvent = { visitor_id: string; event_type: 'visit' | 'download'; video_url: string | null; device: string; browser: string; country: string; city: string; created_at: string };
type Analytics = { totals: { visitors: number; downloads: number }; events: AnalyticsEvent[] };

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [burst, setBurst] = useState<{ x: number; y: number; hue: number } | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    const result = await response.json();
    setMsg(result.message);
    setToast({ type: response.ok ? 'success' : 'error', text: response.ok ? 'Login successful!' : result.message || 'Wrong username or password.' });
    window.setTimeout(() => setToast(null), 3500);
    if (response.ok) {
      const analyticsResponse = await fetch('/api/admin/analytics');
      if (analyticsResponse.ok) setAnalytics(await analyticsResponse.json() as Analytics);
    }
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

  async function loadAnalytics() {
    const response = await fetch('/api/admin/analytics');
    const result = await response.json();
    if (response.ok) setAnalytics(result as Analytics); else setMsg(result.message);
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
    {toast && <div className={`admin-toast ${toast.type}`} role="status">{toast.type === 'success' ? '✓' : '✕'} {toast.text}</div>}
    <section className="admin-card">
      <header className="admin-header"><h1><Crown /> Control Room</h1><span><Lock /> Manage · Publish</span></header>
      <form className="admin-section-card" onSubmit={login}>
        <h2><KeyRound /> Admin Sign In</h2>
        <p className="admin-helper"><ShieldCheck /> Authenticate to unlock publishing tools.</p>
        <div className="admin-form-group"><label htmlFor="admin-username"><Globe2 /> User</label><input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="user 1" required /></div>
        <div className="admin-form-group"><label htmlFor="admin-password"><Lock /> Password</label><input id="admin-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="pass 1" required /></div>
        <div className="admin-action-row"><button className="admin-btn-primary" type="submit"><ArrowRight /> Continue</button><small>Secure · 256-bit</small></div>
      </form>
      <section className="admin-section-card">
        <h2><BarChart3 /> Visitor Analytics</h2>
        <p className="admin-helper"><ShieldCheck /> Secure dashboard · approximate location only · no raw IP storage.</p>
        <div className="admin-action-row"><button className="admin-btn-primary" type="button" onClick={() => void loadAnalytics()}><BarChart3 /> Load Analytics</button><small>Admin login required</small></div>
        {analytics && <div className="analytics-dashboard">
          <div className="analytics-stat"><strong>{analytics.totals.visitors}</strong><span>Unique visitors</span></div>
          <div className="analytics-stat"><strong>{analytics.totals.downloads}</strong><span>Total downloads</span></div>
          <div className="analytics-events">{analytics.events.length === 0 ? <p>No events recorded yet.</p> : analytics.events.map((event, index) => <div className="analytics-event" key={`${event.created_at}-${index}`}><span>{event.event_type === 'download' ? 'Download' : 'Visit'}<small>{new Date(event.created_at).toLocaleString()}</small></span><span>{event.device} · {event.browser}<small>{event.city}, {event.country}</small></span><span>{event.video_url || '—'}</span></div>)}</div>
        </div>}
      </section>
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
