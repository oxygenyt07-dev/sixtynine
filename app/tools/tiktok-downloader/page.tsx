'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock3, Download, Film, Heart, Link as LinkIcon, ShieldCheck, Sparkles, UserRound, Video, XCircle } from 'lucide-react';

type Quality = '720p' | 'max';
type HistoryItem = { id: number; quality: Quality; title: string; status: 'done' | 'failed' };

const defaultHistory: HistoryItem[] = [];

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<Quality>('max');
  const [history, setHistory] = useState<HistoryItem[]>(defaultHistory);
  const [status, setStatus] = useState('Initializing...');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visitorId] = useState(() => {
    if (typeof window === 'undefined') return '';
    const key = 'sixtynine-visitor-id';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(key, created);
    return created;
  });

  useEffect(() => {
    document.title = 'TikTok Video Download Without Watermarks';
    if (visitorId) void fetch('/api/analytics', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ visitorId, event: 'visit' }) });
    const saved = window.localStorage.getItem('sixtynine-tiktok-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved) as HistoryItem[]);
      } catch {
        window.localStorage.removeItem('sixtynine-tiktok-history');
      }
    }
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(event.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('sixtynine-tiktok-history', JSON.stringify(history.slice(0, 8)));
  }, [history]);

  async function downloadVideo() {
    if (loading) return;
    setError('');
    setProgress(10);
    setStatus('Validating TikTok link...');
    setLoading(true);

    try {
      setProgress(30);
      setStatus('Fetching video information...');
      const response = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), quality }),
      });
      const result = await response.json() as { downloadUrl?: string; title?: string; message?: string };
      if (!response.ok || !result.downloadUrl) throw new Error(result.message || 'The video could not be resolved.');

      setProgress(70);
      setStatus(`Preparing ${quality === 'max' ? 'maximum quality' : quality} download...`);
      const downloadResponse = await fetch(`/api/tiktok/download?url=${encodeURIComponent(result.downloadUrl)}`);
      if (!downloadResponse.ok) {
        const downloadError = await downloadResponse.json() as { message?: string };
        throw new Error(downloadError.message || 'Video download failed.');
      }
      const videoBlob = await downloadResponse.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(videoBlob);
      link.download = `sixtynine-tiktok-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setProgress(100);
      setStatus('Download ready — check your browser downloads.');
      const completedItem: HistoryItem = { id: Date.now(), quality, title: result.title || 'TikTok video', status: 'done' };
      setHistory((current) => [completedItem, ...current].slice(0, 8));
      if (visitorId) void fetch('/api/analytics', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ visitorId, event: 'download', videoUrl: url.trim() }) });
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : 'Download failed.';
      setError(message);
      setStatus('Download failed.');
      setProgress(0);
      const failedItem: HistoryItem = { id: Date.now(), quality, title: url.trim() || 'TikTok video', status: 'failed' };
      setHistory((current) => [failedItem, ...current].slice(0, 8));
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    if (window.confirm('Clear download history?')) setHistory([]);
  }

  return <main className="tiktok-page">
    <div className="tiktok-mouse-light" aria-hidden="true" />
    <section className="downloader-card">
      <header className="tiktok-header">
        <h1><span aria-hidden="true">♪</span> TIKTOK VIDEO DOWNLOAD WITHOUT WATERMARKS</h1>
        <div className="tiktok-social"><a href="https://www.instagram.com/is.it.userrrrrrrr" target="_blank" rel="noreferrer" aria-label="Instagram"><img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" /></a><a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer" aria-label="Discord"><img src="https://cdn.simpleicons.org/discord/ffffff" alt="Discord" /></a></div>
      </header>

      <div className="tiktok-badges"><span><CheckCircle /> <strong>COMPLETELY FREE</strong></span><span><Sparkles /> <strong>AD-FREE</strong></span><span><ShieldCheck /> <strong>FULLY SAFE</strong></span></div>

      <section className="tiktok-url-section">
        <label htmlFor="video-url"><LinkIcon /> PASTE TIKTOK VIDEO URL</label>
        <div className="tiktok-input-group">
          <input id="video-url" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void downloadVideo(); }} placeholder="https://www.tiktok.com/@user/video/123456789" autoComplete="url" />
          <button className="tiktok-download-button" type="button" onClick={() => void downloadVideo()} disabled={loading}><Download /> {loading ? 'PROCESSING' : 'DOWNLOAD'}</button>
        </div>
        {error && <p className="tiktok-error" role="alert"><XCircle /> {error}</p>}
      </section>

      <p className="tiktok-select-label"><Video /> SELECT QUALITY</p>
      <div className="tiktok-quality-section">
        <button className={`tiktok-quality-card ${quality === '720p' ? 'active' : ''}`} type="button" onClick={() => setQuality('720p')}><Film /><strong>720p</strong><small>HD · FAST</small></button>
        <button className={`tiktok-quality-card ${quality === 'max' ? 'active' : ''}`} type="button" onClick={() => setQuality('max')}><Video /><strong>MAX</strong><small>HIGHEST AVAILABLE</small></button>
      </div>

      {(loading || progress > 0) && <div className="tiktok-progress" aria-live="polite"><div className="tiktok-progress-bar"><span style={{ width: `${progress}%` }} /></div><div><span>{status}</span><span>{progress}%</span></div></div>}

      <section className="tiktok-history" onDoubleClick={clearHistory}>
        <p><Clock3 /> DOWNLOAD HISTORY <small>(double-click to clear)</small></p>
        {history.length === 0 ? <div className="tiktok-history-item"><span>No downloads yet</span><span>—</span></div> : history.map((item) => <div className="tiktok-history-item" key={item.id}><span>{item.status === 'done' ? <CheckCircle /> : <XCircle />} {item.title}</span><span className={item.status}>{item.status === 'done' ? `${item.quality} · done` : 'failed'}</span></div>)}
      </section>

      <section className="tiktok-about"><div className="tiktok-avatar"><Sparkles /></div><div><h2><UserRound /> SIXTYNINE (AKA ARYAN)</h2><p><Heart /> PROFESSIONAL GAMER &amp; DEVELOPER · BUILDING TOOLS FOR THE COMMUNITY<br /><small><Sparkles /> 100% FREE · NO HIDDEN CHARGES · NO ADS</small></p><span>SAFE · PRIVATE · FAST</span></div></section>
      <footer className="tiktok-footer"><span>© 2026 SIXTYNINE. ALL RIGHTS RESERVED.</span><span>BUILT FOR CREATORS</span></footer>
    </section>
  </main>;
}
