"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";

const PARTNERS = [
  { name: "UNDP", logo: "/partenaires/UNDP Logo.png" },
  { name: "UNICEF", logo: "/partenaires/UNICEF_Logo.png" },
  { name: "Auzy", logo: "/partenaires/auzy-logo.png" },
  { name: "Digimy", logo: "/partenaires/digimy.png" },
  { name: "Educare", logo: "/partenaires/educare-removebg-preview.png" },
  { name: "GIZ", logo: "/partenaires/giz.webp" },
  { name: "Famille", logo: "/partenaires/ministere-de-la-famille-de-la-femme-de-lenfance-et-des-seniors-1-removebg-preview.png" },
  { name: "Psy", logo: "/partenaires/psy logo.png" },
  { name: "Orange", logo: "/partenaires/orange.png" },
];

export function FeaturesSection() {
  // Triple the partners for smoother infinite scroll
  const tripledPartners = useMemo(() => [...PARTNERS, ...PARTNERS, ...PARTNERS], []);

  return (
    <section className="w-full -mt-15 py-6 overflow-hidden bg-[#f95353]/6 border-y border-border/40 relative text-center">
      {/* Marquee container with fade overlays */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Left fade overlay */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 from-background to-transparent z-10 pointer-events-none"
        />

        {/* Right fade overlay */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 from-background to-transparent z-10 pointer-events-none"
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