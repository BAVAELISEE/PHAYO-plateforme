export default function ServiceCard({ code, nom, desc }) {
  return (
    <div className="group border border-ink/10 rounded-2xl p-6 hover:border-amber transition-colors">
      <span className="font-mono text-xs text-amber">{code}</span>
      <h3 className="font-display font-bold text-lg mt-2">{nom}</h3>
      <p className="text-sm text-slate mt-2">{desc}</p>
      <button className="mt-4 text-sm font-medium text-ink group-hover:text-amber transition-colors">
        Consulter →
      </button>
    </div>
  );
}
