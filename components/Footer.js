export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-slate">
          <p>© {new Date().getFullYear()} Plateforme Services — un site, tous les services.</p>
          <p className="font-mono text-xs">Clients · Acteurs · Admin</p>
        </div>

        <div className="border-t border-ink/10 pt-4 flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
          <div className="text-slate">
            <span className="font-medium text-ink">Soutien : </span>
            <span className="font-mono">692 377 932</span>
            <span className="mx-2">ou</span>
            <span className="font-mono">677 606 164</span>
          </div>

          <div className="flex gap-4">
            <a
              href="https://whatsapp.com/channel/0029Vb98OtHGE56fBwx6371l"
              target="_blank"
              rel="noopener noreferrer"
              className="text-verified hover:underline font-medium"
            >
              Suivre notre chaîne WhatsApp
            </a>
            <a
              href="https://chat.whatsapp.com/K9MOnC8uxb0AKjGQuY9JkJ?s=sw&p=a&mlu=4&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-verified hover:underline font-medium"
            >
              Rejoindre le groupe WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
