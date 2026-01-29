
import React from 'react';
import { Category, Property } from '../types';

interface Props {
  categories: Category[];
  properties: Property[];
  onNavigate: (page: 'home' | 'properties' | 'contact') => void;
}

export const PropertyTypes: React.FC<Props> = ({ categories, properties, onNavigate }) => {
  const getCount = (name: string) => properties.filter(p => p.category === name).length;

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Explore por Categorias</h2>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto font-medium">Nossa curadoria exclusiva organizada para facilitar sua busca.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onNavigate('properties')}
              className="group relative h-56 rounded-[32px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border-4 border-white active:scale-95"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:from-[#fcbf49]/80 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white px-4">
                <span className="font-black text-lg tracking-tight mb-1">{cat.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{getCount(cat.name)} Imóveis</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => onNavigate('properties')}
            className="group flex items-center gap-4 bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:border-[#fcbf49] hover:text-[#fcbf49] transition-all shadow-xl shadow-slate-200/50 active:scale-95"
          >
            Ver catálogo completo
            <div className="w-8 h-8 bg-[#fcbf49] rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
