
import React, { useState, useEffect } from 'react';

interface Props {
  onSearch: () => void;
  backgroundImage: string;
}

export const Hero: React.FC<Props> = ({ onSearch, backgroundImage }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 1250;
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(target * progress);
      
      if (frame === totalFrames) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, []);

  return (
    <section className="relative px-4 pb-20 pt-10 overflow-hidden">
      <div className="max-w-7xl mx-auto h-[650px] md:h-[800px] relative rounded-[50px] md:rounded-[60px] overflow-hidden shadow-2xl">
        
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={backgroundImage} 
            alt="Fundo" 
            className="w-full h-full object-cover animate-float-bg transition-all duration-1000"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white z-10">
          <div className="bg-black/30 backdrop-blur-md px-6 py-2.5 rounded-full mb-8 border border-white/30 flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              <span className="w-2 h-2 bg-[#fcbf49] rounded-full animate-pulse shadow-[0_0_8px_#fcbf49]" />
              <span className="text-[11px] font-black text-white">+{count} Imóveis Disponíveis</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white animate-vibrate">
              Excelência no Atendimento
            </span>
          </div>
          
          <h1 className="font-lora text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-[0.9] drop-shadow-2xl">
            Sua Conquista <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcbf49] to-[#f7d794] italic">Começa Aqui</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Personalize sua busca e encontre o imóvel perfeito com a curadoria exclusiva da Imóveis MR.
          </p>

          <form 
            onSubmit={(e) => { e.preventDefault(); onSearch(); }}
            className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 p-2 md:p-3 rounded-[35px] md:rounded-[45px] shadow-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-white/20 flex flex-col items-start text-left">
              <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Localização</label>
              <select className="bg-transparent text-sm font-bold text-white outline-none w-full appearance-none">
                <option value="" className="bg-slate-900">Todas as Regiões</option>
                <option value="sp" className="bg-slate-900">São Paulo</option>
                <option value="rj" className="bg-slate-900">Rio de Janeiro</option>
              </select>
            </div>

            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-white/20 flex flex-col items-start text-left">
              <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Negócio</label>
              <select className="bg-transparent text-sm font-bold text-white outline-none w-full appearance-none">
                <option value="sale" className="bg-slate-900">Comprar</option>
                <option value="rent" className="bg-slate-900">Alugar</option>
              </select>
            </div>

            <div className="flex-[1.5] w-full px-6 py-3 flex flex-col items-start text-left">
              <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Palavra-chave</label>
              <input type="text" placeholder="Ex: Mansão em Itaim" className="bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/40 w-full" />
            </div>

            <button type="submit" className="bg-[#fcbf49] text-white p-5 md:p-6 rounded-[30px] shadow-2xl hover:bg-white hover:text-[#fcbf49] transition-all transform active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
