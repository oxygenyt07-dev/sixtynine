'use client';

import Link from 'next/link';
import { FolderOpen, Shield, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Nav() {
	const pathname = usePathname();
	if (pathname === '/') return null;
	return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111110]/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="font-black tracking-tight"><span className="text-[10px] font-sans font-bold uppercase tracking-[.24em] text-[#d7f36b]">SIXTYNINE / </span><span className="text-lg">Digital archive</span></Link><nav className="hidden items-center gap-7 font-sans text-xs font-bold uppercase tracking-[.12em] text-zinc-400 md:flex"><Link href="/files" className="hover:text-[#d7f36b]"><FolderOpen className="mr-1 inline h-3.5 w-3.5"/>Library</Link><Link href="/tools" className="hover:text-[#d7f36b]"><Wrench className="mr-1 inline h-3.5 w-3.5"/>Tools</Link><Link href="/projects" className="hover:text-[#d7f36b]">Projects</Link></nav><Link href="/admin" className="border border-white/15 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[.15em] hover:border-[#d7f36b] hover:text-[#d7f36b]"><Shield className="mr-1 inline h-3.5 w-3.5"/>Admin</Link></div></header>;
}
