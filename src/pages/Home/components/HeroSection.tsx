import { StarIcon } from "@heroicons/react/24/outline";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="py-4 min-h-80  transition-all rounded-2xl">
      <div className="w-full flex items-center justify-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-green-300 text-sm mb-8">
          <StarIcon className="w-4 h-4 mr-2" />
          Open-Source • Self-Hosted • Senza Pubblicità
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 mt-0">
          Converti i tuoi
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {" "}
            File
          </span>
          <br />
          in totale sicurezza
        </h1>

        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Nessun upload su server esterni, libero da pubblicità e rispettoso
          della tua privacy. Tutte le conversioni avvengono{" "}
          <span className="text-white font-semibold">
            direttamente sul tuo computer.{" "}
          </span>
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
