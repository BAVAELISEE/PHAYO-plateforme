// Illustration vectorielle : une personne souriante devant son ordinateur.
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 380"
      className="w-full h-auto"
      role="img"
      aria-label="Une personne souriante travaillant sur son ordinateur"
    >
      {/* Fond */}
      <circle cx="210" cy="190" r="165" fill="#E8A33D" opacity="0.16" />
      <circle cx="340" cy="60" r="28" fill="#4C9A6A" opacity="0.2" />
      <circle cx="70" cy="300" r="20" fill="#1B1F3B" opacity="0.08" />

      {/* Corps */}
      <path d="M105 340 C105 262 150 236 210 236 C270 236 315 262 315 340 Z" fill="#1B1F3B" />
      {/* Cou */}
      <rect x="195" y="206" width="30" height="38" rx="12" fill="#8D5524" />
      {/* Oreilles */}
      <ellipse cx="164" cy="162" rx="7" ry="11" fill="#7a4720" />
      <ellipse cx="256" cy="162" rx="7" ry="11" fill="#7a4720" />
      {/* Visage */}
      <ellipse cx="210" cy="160" rx="47" ry="53" fill="#8D5524" />
      {/* Cheveux */}
      <path d="M163 152 C160 106 195 96 214 98 C248 100 262 124 258 154 C248 132 232 123 210 123 C190 123 173 130 163 152 Z" fill="#14172c" />
      {/* Yeux */}
      <circle cx="192" cy="158" r="4.5" fill="#14172c" />
      <circle cx="228" cy="158" r="4.5" fill="#14172c" />
      {/* Sourcils */}
      <path d="M183 146 Q192 141 201 146" stroke="#14172c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M219 146 Q228 141 237 146" stroke="#14172c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Sourire */}
      <path d="M190 178 Q210 202 230 178 Z" fill="#ffffff" stroke="#14172c" strokeWidth="3" strokeLinejoin="round" />

      {/* Ordinateur (dos de l'écran) */}
      <rect x="128" y="268" width="164" height="100" rx="10" fill="#4A4E69" />
      <circle cx="210" cy="318" r="9" fill="#E8A33D" />
      <rect x="104" y="366" width="212" height="12" rx="6" fill="#2b2f52" />

      {/* Mains */}
      <circle cx="140" cy="362" r="11" fill="#8D5524" />
      <circle cx="280" cy="362" r="11" fill="#8D5524" />

      {/* Cartes flottantes */}
      <g className="flotte">
        <rect x="10" y="90" width="132" height="50" rx="14" fill="#ffffff" stroke="#1B1F3B" strokeOpacity="0.1" />
        <circle cx="38" cy="115" r="12" fill="#4C9A6A" />
        <path d="M32 115 L37 120 L45 110" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="58" y="112" fontSize="11" fontWeight="700" fill="#1B1F3B">Service</text>
        <text x="58" y="127" fontSize="11" fill="#4A4E69">vérifié</text>
      </g>
      <g className="flotte-2">
        <rect x="290" y="150" width="122" height="50" rx="14" fill="#ffffff" stroke="#1B1F3B" strokeOpacity="0.1" />
        <circle cx="318" cy="175" r="12" fill="#E8A33D" />
        <text x="313" y="180" fontSize="13" fontWeight="700" fill="#fff">★</text>
        <text x="338" y="172" fontSize="11" fontWeight="700" fill="#1B1F3B">Acteurs</text>
        <text x="338" y="187" fontSize="11" fill="#4A4E69">près de vous</text>
      </g>
    </svg>
  );
}
