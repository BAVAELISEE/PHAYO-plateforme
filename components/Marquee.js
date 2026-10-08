const CHAINE = "https://whatsapp.com/channel/0029Vb98OtHGE56fBwx6371l";
const GROUPE = "https://chat.whatsapp.com/K9MOnC8uxb0AKjGQuY9JkJ?s=sw&p=a&mlu=4&ilr=4";

function Segment() {
  return (
    <div className="flex items-center gap-10 pr-10 text-sm font-medium whitespace-nowrap">
      <a href={CHAINE} target="_blank" rel="noopener noreferrer" className="hover:underline">
        📢 Rejoignez notre chaîne WhatsApp
      </a>
      <span aria-hidden="true">•</span>
      <a href={GROUPE} target="_blank" rel="noopener noreferrer" className="hover:underline">
        💬 Rejoignez notre groupe WhatsApp
      </a>
      <span aria-hidden="true">•</span>
      <span>Un site, tous les services</span>
      <span aria-hidden="true">•</span>
      <span>Soutien : 692 377 932 / 677 606 164</span>
      <span aria-hidden="true">•</span>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee overflow-hidden bg-ink text-paper py-2">
      <div className="marquee-track">
        <Segment />
        <Segment />
      </div>
    </div>
  );
}
