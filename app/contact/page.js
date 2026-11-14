export const metadata = { title: "Contact — PHAYO" };

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl">Nous contacter</h1>
      <p className="mt-4 text-ink/80 leading-relaxed">
        Une question, un problème avec votre compte, une suggestion ? Écrivez-nous, nous
        répondons dès que possible.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="carte p-5">
          <p className="font-display font-bold">Téléphone / WhatsApp</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="text-amber hover:underline font-mono" href="https://wa.me/237692377932" target="_blank" rel="noopener noreferrer">
              +237 692 377 932
            </a>
            <a className="text-amber hover:underline font-mono" href="https://wa.me/237677606164" target="_blank" rel="noopener noreferrer">
              +237 677 606 164
            </a>
          </div>
        </div>

        <div className="carte p-5">
          <p className="font-display font-bold">Communauté</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="text-amber hover:underline" href="https://whatsapp.com/channel/0029Vb98OtHGE56fBwx6371l" target="_blank" rel="noopener noreferrer">
              Chaîne WhatsApp
            </a>
            <a className="text-amber hover:underline" href="https://chat.whatsapp.com/K9MOnC8uxb0AKjGQuY9JkJ?s=sw&p=a&mlu=4&ilr=4" target="_blank" rel="noopener noreferrer">
              Groupe WhatsApp
            </a>
          </div>
        </div>
      </div>

      <p className="text-sm text-ink/60 mt-8">
        Pour signaler un contenu abusif ou demander la suppression de vos données, contactez-nous
        sur WhatsApp en précisant le nom de votre compte.
      </p>
    </div>
  );
}
