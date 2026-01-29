
import React from 'react';

interface Props {
  onNavigate: (page: 'home' | 'properties' | 'contact') => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-white py-24 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        
        <div className="col-span-1 md:col-span-1">
          <div onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-8 cursor-pointer">
            <div className="w-10 h-10 bg-[#fcbf49] rounded-xl flex items-center justify-center shadow-lg shadow-[#fcbf49]/20">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-2xl font-black tracking-tighter">
              Imóveis <span className="text-[#fcbf49]">MR</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
           Conectando famílias ao seu novo estilo de vida.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-white">Links Rápidos</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><button onClick={() => onNavigate('home')} className="hover:text-[#fcbf49] transition-colors text-left">Início</button></li>
            <li><button onClick={() => onNavigate('properties')} className="hover:text-[#fcbf49] transition-colors text-left">Ver Imóveis</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-[#fcbf49] transition-colors text-left">Contato</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-white">Suporte</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><a href="#" className="hover:text-[#fcbf49] transition-colors">Perguntas Frequentes</a></li>
            <li><a href="#" className="hover:text-[#fcbf49] transition-colors">Termos e Condições</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 text-white">Newsletter</h4>
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="Seu e-mail" className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 ring-[#fcbf49] outline-none" />
            <button className="bg-[#fcbf49] text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-[#fcbf49]/10 hover:bg-[#f0b030] transition-colors">
              Inscrever-se
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-20 mt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-semibold">
        <p>&copy; 2024 Imóveis MR. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
