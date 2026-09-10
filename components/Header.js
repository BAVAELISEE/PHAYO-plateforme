import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg tracking-tight">
          Plateforme<span className="text-amber">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-slate">
          <Link href="/services/distance" className="hover:text-ink">Services à distance</Link>
          <Link href="/services/presentiel" className="hover:text-ink">Services présentiels</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate hover:text-ink">Connexion</Link>
          <Link
            href="/register"
            className="text-sm bg-ink text-paper px-4 py-2 rounded-full hover:bg-ink/90"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
