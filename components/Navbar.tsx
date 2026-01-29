
import React from 'react';

interface Props {
  onNavigate: (page: 'home' | 'properties' | 'contact' | 'admin') => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({ onNavigate, isLoggedIn, onLoginClick, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-8">
        
        <div onClick={() => onNavigate('home')} className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-10 h-10 bg-[#fcbf49] rounded-xl flex items-center justify-center shadow-lg shadow-[#fcbf49]/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-slate-900">
            Imóveis <span className="text-[#fcbf49]">MR</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => onNavigate('home')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#fcbf49] transition-all">Início</button>
          <button onClick={() => onNavigate('properties')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#fcbf49] transition-all">Propriedades</button>
          <button onClick={() => onNavigate('contact')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#fcbf49] transition-all">Contato</button>
          {isLoggedIn && <button onClick={() => onNavigate('admin')} className="text-xs font-black uppercase tracking-widest text-[#fcbf49]">Gestão MR</button>}
        </div>

        <div className="flex items-center gap-4">
           {isLoggedIn ? (
             <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors">Sair</button>
           ) : (
             <button onClick={onLoginClick} className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">Gestão MR</button>
           )}
           <button onClick={() => onNavigate('contact')} className="bg-[#fcbf49] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#fcbf49]/20 hover:bg-[#f0b030] transition-all">
            Contato
           </button>
        </div>
      </div>
    </nav>
  );
};
