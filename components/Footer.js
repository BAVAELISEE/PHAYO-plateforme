export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-slate">
          <p>© {new Date().getFullYear()} Plateforme Services — un site, tous les services.</p>
          <p className="font-mono text-xs">Clients · Acteurs · Admin</p>
        </div>
        <div className="border-t border-ink/10 pt-4 text-sm text-slate">
          <span className="font-medium text-ink">Soutien : </span>
          <span className="font-mono">692 377 932</span>
          <span className="mx-2">ou</span>
          <span className="font-mono">677 606 164</span>
        </div>
      </div>
    </footer>
  );
}
