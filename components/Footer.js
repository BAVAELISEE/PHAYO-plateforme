import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <p className="font-display font-bold text-xl">PHAYO<span className="text-amber">.</span></p>
          <p className="text-paper/70 mt-3 max-w-xs">
            Un site, tous les services : la plateforme qui relie clients et acteurs.
          </p>
        </div>

        <div>
          <p className="font-medium mb-3">Navigation</p>
          <div className="grid gap-2 text-paper/70">
            <Link href="/services" className="hover:text-paper">Services</Link>
            <Link href="/articles" className="hover:text-paper">Articles</Link>
            <Link href="/profil" className="hover:text-paper">Mon profil</Link>
          </div>
        </div>

        <div>
          <p className="font-medium mb-3">Nous rejoindre</p>
          <div className="grid gap-2">
            <a
              href="https://whatsapp.com/channel/0029Vb98OtHGE56fBwx6371l"
              target="_blank" rel="noopener noreferrer"
              className="text-amber hover:underline"
            >
              Suivre notre chaîne WhatsApp
            </a>
            <a
              href="https://chat.whatsapp.com/K9MOnC8uxb0AKjGQuY9JkJ?s=sw&p=a&mlu=4&ilr=4"
              target="_blank" rel="noopener noreferrer"
              className="text-amber hover:underline"
            >
              Rejoindre le groupe WhatsApp
            </a>
          </div>
          <p className="text-paper/70 mt-4">
            Soutien : <span className="font-mono">692 377 932</span> ou{" "}
            <span className="font-mono">677 606 164</span>
          </p>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} PHAYO Plateforme — Tous droits réservés.
      </div>
    </footer>
  );
}
