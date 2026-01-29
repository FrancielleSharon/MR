
import React from 'react';

interface Props {
  onNavigate: (page: 'home' | 'properties' | 'contact') => void;
}

export const Services: React.FC<Props> = ({ onNavigate }) => {
  const services = [
    {
      title: 'Compre com confiança',
      description: 'Acompanhamento jurídico e financeiro completo para sua nova aquisição.',
      icon: '🏢',
      cta: 'Explorar Casas',
      page: 'properties' as const,
      color: 'bg-blue-50'
    },
    {
      title: 'Consultoria',
      description: 'Atendimento exclusivo e consultoria.',
      icon: '💎',
      cta: 'Agendar Consultoria',
      page: 'contact' as const,
      color: 'bg-[#FFF9E5]'
    },
    {
      title: 'Alugue sem burocracia',
      description: 'Processo 100% digital para você se mudar em tempo recorde.',
      icon: '🔑',
      cta: 'Ver Aluguéis',
      page: 'properties' as const,
      color: 'bg-green-50'
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">O que fazemos por você</h2>
        <p className="text-slate-500 text-lg mb-20 max-w-2xl mx-auto leading-relaxed">
          Nossa missão é transformar a experiência de encontrar um imóvel em algo simples e prazeroso.
        </p>
        
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((s) => (
            <div key={s.title} className={`${s.color} p-12 rounded-[40px] border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-2 group`}>
              <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{s.title}</h3>
              <p className="text-slate-600 mb-10 leading-relaxed font-medium">{s.description}</p>
              <button 
                onClick={() => onNavigate(s.page)}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                  s.cta === 'Agendar Consultoria' 
                  ? 'bg-[#fcbf49] text-white shadow-lg shadow-[#fcbf49]/20 hover:bg-[#f0b030]' 
                  : 'bg-white text-slate-900 border border-slate-200 hover:border-[#fcbf49] hover:text-[#fcbf49]'
                }`}
              >
                {s.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
