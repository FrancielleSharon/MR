
import React from 'react';
import { Property } from '../types';

interface Props {
  properties: Property[];
  onViewAll: () => void;
  onViewDetails: (p: Property) => void;
}

export const FeaturedListings: React.FC<Props> = ({ properties, onViewAll, onViewDetails }) => {
  return (
    <section className="py-24 px-4 bg-white mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Destaques da Semana</h2>
            <p className="text-slate-500 font-medium">As melhores oportunidades selecionadas para você.</p>
          </div>
          <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-2 text-sm font-black text-[#fcbf49] hover:gap-4 transition-all"
          >
            Ver catálogo completo
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property) => (
            <div 
              key={property.id} 
              onClick={() => onViewDetails(property)}
              className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full text-white shadow-lg ${property.type === 'sale' ? 'bg-[#fcbf49]' : 'bg-blue-600'}`}>
                    {property.type === 'sale' ? 'Venda' : 'Aluguel'}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase rounded-full text-[#fcbf49] shadow-lg">⭐ Destaque</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#fcbf49] transition-colors">{property.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {property.location}
                </div>

                <div className="flex gap-6 mb-8 py-4 border-y border-slate-50">
                   <div className="flex items-center gap-2">
                      <span className="text-xl">🚿</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Banh.</span>
                        <span className="text-xs font-black text-slate-900 leading-none">{property.baths}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xl">📐</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Metr.</span>
                        <span className="text-xs font-black text-slate-900 leading-none">{property.sqft}m²</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xl">🛏️</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Qts.</span>
                        <span className="text-xs font-black text-slate-900 leading-none">{property.beds}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Preço Final</span>
                    <span className="text-[#fcbf49] font-black text-2xl tracking-tighter">{property.price}</span>
                  </div>
                  <button className="bg-slate-50 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-[#fcbf49] group-hover:text-white transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
