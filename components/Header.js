"use client";

import { useState } from "react";
import Link from "next/link";

const LIENS = [
  { href: "/services", texte: "Services" },
  { href: "/articles", texte: "Articles" },
  { href: "/profil", texte: "Mon profil" },
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          PHAYO<span className="text-amber">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.texte}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate hover:text-ink">Connexion</Link>
          <Link href="/register" className="text-sm bg-ink text-paper px-5 py-2 rounded-full hover:bg-ink/90">
            S'inscrire
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOuvert(!ouvert)}
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {ouvert && (
        <div className="md:hidden border-t border-ink/10 bg-paper px-6 py-4 grid gap-4 text-sm">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOuvert(false)} className="text-slate">
              {l.texte}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" onClick={() => setOuvert(false)} className="btn-secondaire flex-1 text-center !px-4 !py-2">
              Connexion
            </Link>
            <Link href="/register" onClick={() => setOuvert(false)} className="btn-principal flex-1 text-center !px-4 !py-2">
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
