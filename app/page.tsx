'use client';

import { useEffect, useState } from 'react';
import { Archive, Ban, Bolt, Camera, Code2, Download, Flame, Gamepad2, History, Laptop, MousePointer2, Package, Palette, Shield, Smartphone, Sparkles, Terminal, Wrench } from 'lucide-react';

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
  { name: 'Revo Uninstaller', icon: Package },
  { name: 'ZArchiver', icon: Archive },
  { name: 'Skin Tool for FF', icon: Palette },
  { name: 'Safe TikTok Video', icon: Shield },
  { name: 'FF 2022 Old APK', icon: Download, href: oldApkUrl },
  { name: 'More tools soon', icon: History, soon: true },
];
const mobile: Item[] = [
  { name: 'ZArchiver', icon: Archive },
  { name: 'Skin Tool for FF', icon: Palette },
  { name: 'Safe TikTok Video', icon: Shield },
  { name: 'FF 2022 Old APK', icon: Download, href: oldApkUrl },
  { name: 'More coming', icon: History, soon: true },
];

export default function Home() {
  const [device, setDevice] = useState<Device>('pc');
  const [category, setCategory] = useState<PcCategory>('ff');
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; hue: number }>>([]);
  const items = device === 'mobile' ? mobile : category === 'ff' ? freeFire : pcTools;
  const title = device === 'mobile' ? 'Mobile' : category === 'ff' ? 'Free Fire' : 'PC Tools';
  const TitleIcon = device === 'mobile' ? Smartphone : category === 'ff' ? Flame : Wrench;

  useEffect(() => {
    const move = (event: MouseEvent) => setLight({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  function chooseDevice(next: Device) { setDevice(next); if (next === 'pc') setCategory('ff'); }
  function burst(event: React.MouseEvent) {
    const id = Date.now();
    setBursts((current) => [...current, { id, x: event.clientX, y: event.clientY, hue: Math.floor(Math.random() * 360) }]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== id)), 750);
  }

  return <main className="hub-shell" style={{ '--mouse-x': `${light.x}%`, '--mouse-y': `${light.y}%` } as React.CSSProperties} onClick={burst}>
    <div className="mouse-light" aria-hidden="true" />
    {bursts.map((item) => <span key={item.id} className="click-burst" style={{ left: item.x, top: item.y, background: `radial-gradient(circle, hsl(${item.hue} 85% 70%), transparent 70%)` }} />)}
    <section className="hub-card">
      <header className="hub-header"><div><h1>✦ SIXTYNINE HUB</h1><p><Bolt className="inline-icon" /> TOOLS · PC · MOBILE · FREE</p></div><div className="social-links"><a href="https://www.instagram.com/is.it.userrrrrrrr" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera /></a><a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer" aria-label="Discord"><Gamepad2 /></a></div></header>
      <div className="made-by"><span>♛ <strong>SIXTYNINE</strong> (AKA ARYAN) — PROFESSIONAL GAMER &amp; DEVELOPER</span><span><Code2 className="inline-icon" /> THIS HUB PROVIDES TOOLS FOR PC &amp; MOBILE · FREE DOWNLOADS</span><span><Download className="inline-icon" /> ALL FILES HOSTED ON MEDIAFIRE</span></div>
      <div className="step-container"><p className="step-label">▼ &nbsp; SELECT YOUR DEVICE</p><div className="choice-group"><button className={`choice-btn ${device === 'pc' ? 'active' : ''}`} onClick={() => chooseDevice('pc')}><Laptop /> PC</button><button className={`choice-btn ${device === 'mobile' ? 'active' : ''}`} onClick={() => chooseDevice('mobile')}><Smartphone /> MOBILE</button></div></div>
      {device === 'pc' && <div className="step-container"><p className="step-label faded">→ &nbsp; PC CATEGORY</p><div className="sub-choice"><button className={`sub-btn ${category === 'ff' ? 'active-sub' : ''}`} onClick={() => setCategory('ff')}><Flame /> FREE FIRE</button><button className={`sub-btn ${category === 'tools' ? 'active-sub' : ''}`} onClick={() => setCategory('tools')}><Wrench /> PC TOOLS</button></div></div>}
      <section className="platform-section"><h2><TitleIcon /> {title}</h2>{items.map((item) => { const ItemIcon = item.icon; const target = item.href || '/files'; return <div className={`file-item ${item.soon ? 'coming-soon' : ''}`} key={item.name}><span><ItemIcon /> {item.name}</span>{item.soon ? <em>SOON</em> : <a href={target} target={item.href ? '_blank' : undefined} rel={item.href ? 'noopener noreferrer' : undefined} onClick={(event) => event.stopPropagation()}><Download /> DL</a>}</div>; })}</section>
      <footer className="footer-note"><span>© 2026 SIXTYNINE. ALL RIGHTS RESERVED.</span><span>♧ JOIN SUPPORT · <a href="https://discord.gg/t9CTUUBRwU" target="_blank" rel="noreferrer">DISCORD</a></span><span>→ CLICK ANYWHERE · COLORFUL BURST</span></footer>
    </section>
  </main>;
}
