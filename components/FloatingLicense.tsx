
import React from 'react';

/**
 * Componente FloatingLicense
 * Exibe a identificação da corretora em uma barra flutuante discreta na base da página.
 */
export const FloatingLicense: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] px-4 w-full max-w-fit pointer-events-none">
      <div className="bg-white/70 backdrop-blur-xl border border-[#fcbf49]/20 px-6 py-2.5 rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center justify-center w-5 h-5 bg-[#fcbf49]/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-[#fcbf49] rounded-full shadow-[0_0_8px_#fcbf49]" />
        </div>
        <span className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] whitespace-nowrap">
          Maria de Loudes lima <span className="text-[#fcbf49] opacity-50 mx-2">—</span> Creci 19855-F
        </span>
      </div>
    </div>
  );
};
