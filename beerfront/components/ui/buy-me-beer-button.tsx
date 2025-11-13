"use client";

export default function BuyMeBeerButton() {
  return (
    <a
      href="https://www.buymeacoffee.com/rmxzy"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 backdrop-blur-sm text-black font-bold text-lg rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/40 border-2 border-amber-600"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="drop-shadow-sm"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" strokeWidth="2" />
        <line x1="10" y1="1" x2="10" y2="4" strokeWidth="2" />
        <line x1="14" y1="1" x2="14" y2="4" strokeWidth="2" />
      </svg>
      <span className="drop-shadow-sm">Buy me a beer 🍺</span>
    </a>
  );
}

