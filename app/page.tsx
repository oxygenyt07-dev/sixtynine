'use client';

import { useEffect, useRef, useState } from 'react';
import { Archive, Ban, Bolt, Calculator, Code2, Computer, Crosshair, Download, Flame, Gamepad2, History, Laptop, MousePointer2, Network, Package, Palette, Shield, Smartphone, Sparkles, Terminal, Wrench } from 'lucide-react';

type Device = 'pc' | 'mobile';
type PcCategory = 'ff' | 'tools';
type Item = { name: string; icon: typeof Archive; href?: string; soon?: boolean };

const oldApkUrl = 'https://www.mediafire.com/file/7qcd0n98tab3znf/SIXTYNINE+PANEL.zip/file';

const freeFire: Item[] = [
  { name: 'Old 2022 FF APK', icon: History, href: oldApkUrl },
  { name: 'PC + Mobile FF APK', icon: Gamepad2 },
  { name: 'Emulator', icon: Terminal },
  { name: 'Free Panel', icon: Ban },
  { name: 'Free Bypass', icon: Shield },
  { name: 'Mouse Cursor Customize', icon: MousePointer2 },
  { name: 'Other coming soon', icon: History, soon: true },
];
const pcTools: Item[] = [
  { name: 'PC Cleaner', icon: Sparkles },
  { name: 'PC Optimizer', icon: Sparkles },
  { name: 'FPS Booster', icon: Flame },
  { name: 'Custom Mouse Cursor', icon: MousePointer2 },
  { name: 'Emulator Settings', icon: Gamepad2 },
  { name: 'Crosshair Tool', icon: Crosshair },
  { name: 'Windows Debloat Tool', icon: Wrench },
  { name: 'PC Specs Checker', icon: Computer },
  { name: 'Keyboard Tester', icon: Terminal },
  { name: 'Mouse Tester', icon: MousePointer2 },
  { name: 'Ping & Internet Tester', icon: Network },
  { name: 'DLL/Runtime Installer Hub', icon: Package },
  { name: 'SixtyNine Gaming Toolkit', icon: Sparkles },
  { name: 'Sensitivity Converter', icon: Crosshair },
  { name: 'Resolution Calculator', icon: Calculator },
  { name: 'DPI to Sensitivity Calculator', icon: Calculator },
  { name: 'Storage Calculator', icon: Calculator },
  { name: 'FPS / Refresh Rate Calculator', icon: Calculator },
  { name: 'Ping Calculator', icon: Network },
  { name: 'PC Bottleneck Calculator', icon: Computer },
  { name: 'Game Config Generator', icon: Terminal },
  { name: 'File Hash / Integrity Checker', icon: Shield },
  { name: 'Image Compressor', icon: Palette },
  { name: 'PDF Compressor', icon: Package },
  { name: 'Link Shortener', icon: Network },
  { name: 'Password Generator', icon: Shield },
  { name: 'IP / Network Information Tool', icon: Network },
  { name: 'FF 2022 Old APK', icon: Download, href: oldApkUrl },
];
const mobile: Item[] = [
  { name: 'ZArchiver Guide / Downloads', icon: Archive },
  { name: 'Game Config Manager', icon: Gamepad2 },
  { name: 'Storage Cleaner', icon: Sparkles },
  { name: 'Device Info', icon: Computer },
  { name: 'Gaming Optimization Guide', icon: Flame },
  { name: 'Sensitivity Calculator', icon: Crosshair },
  { name: 'Screen / DPI Calculator', icon: Calculator },
  { name: 'Battery & Performance Tips', icon: Bolt },
  { name: 'File Manager Utilities', icon: Package },
  { name: 'APK Information Checker', icon: Shield },
  { name: 'FF 2022 Old APK', icon: Download, href: oldApkUrl },
];


export default function Home() {
  const [introStage, setIntroStage] = useState<'loading' | 'playing' | 'welcome' | 'hub'>('loading');
  const [device, setDevice] = useState<Device | null>(null);
  const [category, setCategory] = useState<PcCategory>('tools');
  const [comingSoon, setComingSoon] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const introAudioRef = useRef<HTMLAudioElement>(null);
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; hue: number }>>([]);
  const items = device === 'mobile' ? mobile : category === 'ff' ? freeFire : pcTools;
  const title = device === 'mobile' ? 'Mobile' : category === 'ff' ? 'Free Fire' : 'PC Tools';
  const TitleIcon = device === 'mobile' ? Smartphone : category === 'ff' ? Flame : Wrench;

  useEffect(() => {
    const move = (event: MouseEvent) => setLight({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, []);

  function startIntroAudio() {
    const audio = introAudioRef.current;
    if (!audio || introStage !== 'loading') return;
    setIntroStage('playing');
    audio.currentTime = 0;
    audio.play().catch(finishIntroAudio);
  }

  function finishIntroAudio() {
    setIntroStage('welcome');
    window.dispatchEvent(new Event('sixtynine:start-music'));
  }

  function continueToHub() {
    setIntroStage('hub');
  }

  function chooseDevice(next: Device) { setDevice(next); if (next === 'pc') setCategory('tools'); }
  function showComingSoon(event: React.MouseEvent) {
    event.stopPropagation();
    setComingSoon(true);
    window.setTimeout(() => setComingSoon(false), 2000);
  }
  function burst(event: React.MouseEvent) {
    const id = Date.now();
    setBursts((current) => [...current, { id, x: event.clientX, y: event.clientY, hue: Math.floor(Math.random() * 360) }]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== id)), 750);
  }

  if (introStage !== 'hub') {
    return <main className="intro-screen">
      <video ref={introVideoRef} className="intro-video" autoPlay muted loop playsInline aria-hidden="true"><source src="/loading.mp4" type="video/mp4" /></video>
      <audio ref={introAudioRef} onEnded={finishIntroAudio} preload="auto" aria-hidden="true"><source src="/loading-audio.mp4" type="audio/mp4" /></audio>
      <div className="intro-video-shade" aria-hidden="true" />
      {introStage !== 'welcome' ? <div className="intro-loading" aria-label="Loading SixtyNine Hub">
        <div className="intro-loading-copy">
          <p className="welcome-kicker">Welcome to</p>
          <h1>SIXTYNINE HUB</h1>
          <p className="welcome-alias">AKA ARYAN</p>
          {introStage === 'loading' ? <button className="tap-begin-button" type="button" onClick={startIntroAudio}>TAP TO BEGIN <span aria-hidden="true">→</span></button> : <p className="intro-loading-label">Loading your gaming hub...</p>}
        </div>
      </div> : <section className="welcome-panel">
        <p className="welcome-kicker">Welcome to</p>
        <h1>SIXTYNINE HUB</h1>
        <p className="welcome-alias">AKA ARYAN</p>
        <p className="welcome-intro">I&apos;m Aryan, a gamer and developer building a simple place for useful PC and mobile tools, gaming resources, and free downloads.</p>
        <button className="continue-button" onClick={continueToHub}>Continue to the website <span aria-hidden="true">→</span></button>
      </section>}
    </main>;
  }

  return <main className="hub-shell" style={{ '--mouse-x': `${light.x}%`, '--mouse-y': `${light.y}%` } as React.CSSProperties} onClick={burst}>
    <div className="mouse-light" aria-hidden="true" />
    {comingSoon && <div className="coming-soon-popup" role="status">Coming soon</div>}
    {bursts.map((item) => <span key={item.id} className="click-burst" style={{ left: item.x, top: item.y, background: `radial-gradient(circle, hsl(${item.hue} 85% 70%), transparent 70%)` }} />)}
    <section className="hub-card">
      <header className="hub-header"><div><h1>✦ SIXTYNINE HUB</h1><p><Bolt className="inline-icon" /> TOOLS · PC · MOBILE · FREE</p></div><div className="social-links"><a href="https://www.instagram.com/is.it.userrrrrrrr" target="_blank" rel="noreferrer" aria-label="Instagram"><img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" /></a><a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer" aria-label="Discord"><img src="https://cdn.simpleicons.org/discord/ffffff" alt="Discord" /></a></div></header>
      <div className="made-by"><span>♛ <strong>SIXTYNINE</strong> (AKA ARYAN) — PROFESSIONAL GAMER &amp; DEVELOPER</span><span><Code2 className="inline-icon" /> THIS HUB PROVIDES TOOLS FOR PC &amp; MOBILE · FREE DOWNLOADS</span><span><Download className="inline-icon" /> ALL FILES HOSTED ON MEDIAFIRE</span></div>
      <div className="step-container"><p className="step-label">▼ &nbsp; SELECT YOUR DEVICE</p><div className="choice-group"><button className={`choice-btn ${device === 'pc' ? 'active' : ''}`} onClick={() => chooseDevice('pc')}><Laptop /> PC</button><button className={`choice-btn ${device === 'mobile' ? 'active' : ''}`} onClick={() => chooseDevice('mobile')}><Smartphone /> MOBILE</button></div></div>
      {device === 'pc' && <div className="step-container"><p className="step-label faded">→ &nbsp; PC CATEGORY</p><div className="sub-choice"><button className={`sub-btn ${category === 'ff' ? 'active-sub' : ''}`} onClick={() => setCategory('ff')}><Flame /> FREE FIRE</button><button className={`sub-btn ${category === 'tools' ? 'active-sub' : ''}`} onClick={() => setCategory('tools')}><Wrench /> PC TOOLS</button></div></div>}
      {device && <section className="platform-section"><h2><TitleIcon /> {title}</h2>{items.map((item) => { const ItemIcon = item.icon; return <div className="file-item" key={item.name}><span><ItemIcon /> {item.name}</span>{item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}><Download /> DL</a> : <button className="file-coming-soon" type="button" onClick={showComingSoon}><Download /> DL</button>}</div>; })}</section>}
      <footer className="footer-note"><span>© 2026 SIXTYNINE. ALL RIGHTS RESERVED.</span><span>♧ JOIN SUPPORT · <a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer">DISCORD</a></span><span>→ CLICK ANYWHERE · COLORFUL BURST</span></footer>
    </section>
  </main>;
}
