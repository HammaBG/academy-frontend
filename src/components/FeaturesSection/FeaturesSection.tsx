"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";

const PARTNERS = [
  { name: "UNDP", logo: "/partenaires/UNDP Logo.png" },
  { name: "UNICEF", logo: "/partenaires/UNICEF_Logo.png" },
  { name: "Auzy", logo: "/partenaires/auzy-logo.png" },
  { name: "Digimy", logo: "/partenaires/digimy.png" },
  { name: "Educare", logo: "/partenaires/educare.png" },
  { name: "GIZ", logo: "/partenaires/giz.webp" },
  { name: "Famille", logo: "/partenaires/ministere-de-la-famille-de-la-femme-de-lenfance-et-des-seniors-1.webp" },
  { name: "Psy", logo: "/partenaires/psy logo.png" },
  { name: "Zitouna", logo: "/partenaires/zitouna.png" },
];

export function FeaturesSection() {
  // Triple the partners for smoother infinite scroll
  const tripledPartners = useMemo(() => [...PARTNERS, ...PARTNERS, ...PARTNERS], []);

  return (
    <section className="w-full py-16 overflow-hidden bg-surface/30 border-y border-border/40 relative text-center">
      {/* Improved Header Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-10 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-black text-text-primary">
          نخبة المؤسسات <span className="text-brand-primary">والمنظمات الداعمة</span>
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm max-w-md font-medium mt-1">
          نفخر بالتعاون مع كبرى الجهات والمنظمات الإقليمية والدولية لبناء مستقبل تعليمي أفضل.
        </p>
      </div>

      {/* Marquee container with fade overlays */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Left fade overlay */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"
        />

        {/* Right fade overlay */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"
        />

        {/* Moving row - moves continuously */}
        <div className="flex w-max gap-16 items-center animate-marquee-left">
          {tripledPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center justify-center h-16 w-36 shrink-0 filter grayscale opacity-45 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 max-w-full object-contain dark:brightness-200 dark:contrast-75"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}