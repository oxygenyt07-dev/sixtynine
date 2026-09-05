'use client';

import { useState } from 'react';
import { ArrowRight, Monitor, ShieldCheck, Smartphone } from 'lucide-react';
import Link from 'next/link';

const pc = ['PC Cleaner', 'FF 2022 Archive', 'PC + Mobile Resources', 'Emulator Utilities', 'Custom Mouse Cursor', 'Aim & Sensitivity Tools', 'Other / Coming Soon'];
const mobile = ['ZArchiver Resources', 'Skin Tool Resources', 'Safe TikTok Video Tools', 'Old 2022 Mobile Archive', 'Device Optimizers', 'Other / Coming Soon'];

export default function DevicePicker() {
	const [device, setDevice] = useState<'pc' | 'mobile' | null>(null);

	return (
		<section className="mx-auto max-w-7xl px-5 py-20">
			<div className="mb-8">
				<p className="section-label">Resource lanes</p>
				<h2 className="mt-2 text-3xl font-black md:text-5xl">Pick your <span className="gradient-text">loadout.</span></h2>
				<p className="mt-3 max-w-xl text-zinc-400">Choose a device to see resources organized for the way you play.</p>
			</div>
			<div className="grid gap-5 md:grid-cols-2">
				{[
					['pc', 'PC USER', Monitor, pc, 'text-cyan-300'],
					['mobile', 'MOBILE USER', Smartphone, mobile, 'text-pink-300'],
				].map(([key, title, Icon, items, accent]: any) => (
					<button key={key} onClick={() => setDevice(key)} className={`gaming-card glass rgb-border rounded-3xl p-7 text-left ${device === key ? 'ring-2 ring-lime-300/60' : ''}`}>
						<div className="flex items-start justify-between"><Icon className={`mb-5 h-9 w-9 ${accent}`} />{device === key && <ShieldCheck className="h-5 w-5 text-lime-300" />}</div>
						<h3 className="text-2xl font-black">{title}</h3>
						<div className="mt-5 grid gap-2 sm:grid-cols-2">{items.map((item: string) => <span key={item} className="rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-zinc-300">{item}</span>)}</div>
						<span className="mt-6 inline-flex items-center text-sm font-semibold text-lime-300">Browse matching files <ArrowRight className="ml-2 h-4 w-4" /></span>
					</button>
				))}
			</div>
			{device && <div className="mt-6 flex items-center justify-between rounded-2xl border border-lime-300/20 bg-lime-300/5 p-5"><span className="text-sm text-zinc-300">Device profile selected: <b className="text-white">{device === 'pc' ? 'PC' : 'Mobile'}</b></span><Link className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-bold text-black" href={`/files?device=${device}`}>Explore files</Link></div>}
		</section>
	);
}
