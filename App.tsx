
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedListings } from './components/FeaturedListings';
import { PropertyTypes } from './components/PropertyTypes';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { FloatingLicense } from './components/FloatingLicense';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Property, Category } from './types';

// Imagem padrão caso o site inicie sem nada
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=100&w=1600";
// Link direto para o WhatsApp do corretor
const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5511986054846&text=Ol%C3%A1%2C%20vim%20do%20MR%20im%C3%B3veis";

const App: React.FC = () => {
  // Estados de navegação e controle
  const [currentPage, setCurrentPage] = useState<'home' | 'properties' | 'contact' | 'details' | 'admin'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Carrega categorias do armazenamento local ou usa as iniciais
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mr_categories_v3');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Casas', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400' },
      { id: '2', name: 'Apartamentos', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400' },
      { id: '3', name: 'Escritórios', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=400' }
    ];
  });

  // Carrega imóveis do armazenamento local
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('mr_properties_v3');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Salva os dados sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('mr_properties_v3', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('mr_categories_v3', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const savedHero = localStorage.getItem('mr_hero_image_v3');
    if (savedHero) setHeroImage(savedHero);

    const sessionLogin = sessionStorage.getItem('mr_session_login');
    if (sessionLogin === 'true') setIsLoggedIn(true);
  }, []);

  // Funções de atualização
  const handleUpdateHeroImage = (newUrl: string) => {
    setHeroImage(newUrl || DEFAULT_HERO_IMAGE);
    localStorage.setItem('mr_hero_image_v3', newUrl || DEFAULT_HERO_IMAGE);
  };

  // Lógica de navegação simplificada
  const navigateTo = (page: 'home' | 'properties' | 'contact' | 'admin') => {
    if (page === 'contact') {
      window.open(WHATSAPP_URL, '_blank'); // Abre WhatsApp em nova aba
      return;
    }
    if (page === 'admin' && !isLoggedIn) {
      setShowLoginModal(true); // Pede login se não estiver logado
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Abre a página de detalhes do imóvel
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setActiveImageIndex(0); // Reseta o carrossel para a primeira foto
    setCurrentPage('details');
    window.scrollTo(0, 0);
  };

  // Gerenciamento de imóveis (Admin)
  const handleAddProperty = (newProperty: Property) => setProperties(prev => [newProperty, ...prev]);
  const handleRemoveProperty = (id: string) => setProperties(prev => prev.filter(p => p.id !== id));
  const handleUpdateStatus = (id: string, newStatus: any) => setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  const handleToggleFeatured = (id: string) => setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  
  const handleAddCategory = (cat: Category) => setCategories(prev => [...prev, cat]);
  const handleRemoveCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('mr_session_login', 'true');
    setShowLoginModal(false);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('mr_session_login');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onNavigate={navigateTo} isLoggedIn={isLoggedIn} onLoginClick={() => setShowLoginModal(true)} onLogout={handleLogout} />
      
      <main className="flex-grow pt-20">
        {/* PÁGINA INICIAL */}
        {currentPage === 'home' && (
          <>
            <Hero onSearch={() => navigateTo('properties')} backgroundImage={heroImage} />
            <FeaturedListings 
              properties={properties.filter(p => p.featured && p.status === 'available')} 
              onViewAll={() => navigateTo('properties')}
              onViewDetails={handleViewDetails}
            />
            <PropertyTypes categories={categories} properties={properties} onNavigate={navigateTo} />
            <Services onNavigate={navigateTo} />
          </>
        )}

        {/* LISTAGEM DE PROPRIEDADES */}
        {currentPage === 'properties' && (
          <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-black text-slate-900 mb-8">Catálogo Completo</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {properties.filter(p => p.status === 'available').map(p => (
                <PropertyCard key={p.id} property={p} onDetails={() => handleViewDetails(p)} />
              ))}
            </div>
            {properties.filter(p => p.status === 'available').length === 0 && (
              <p className="text-center py-20 text-slate-400 font-bold italic">Sem imóveis disponíveis.</p>
            )}
          </div>
        )}

        {/* PAINEL ADMINISTRATIVO (GESTÃO MR) */}
        {currentPage === 'admin' && (
          <AdminPanel 
            properties={properties}
            categories={categories}
            heroImage={heroImage}
            onAddProperty={handleAddProperty} 
            onRemoveProperty={handleRemoveProperty}
            onUpdateStatus={handleUpdateStatus}
            onToggleFeatured={handleToggleFeatured}
            onUpdateHeroImage={handleUpdateHeroImage}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onCancel={() => navigateTo('home')} 
          />
        )}

        {/* DETALHES DO IMÓVEL COM CARROSSEL */}
        {currentPage === 'details' && selectedProperty && (
          <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in duration-500">
             <button onClick={() => navigateTo('properties')} className="mb-8 text-[#fcbf49] font-black uppercase text-xs tracking-widest flex items-center gap-2 group">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#fcbf49] group-hover:text-white transition-all">←</span>
                Voltar para o catálogo
             </button>
             <div className="grid lg:grid-cols-2 gap-16">
                <div className="space-y-4">
                   {/* Carrossel de Imagens Principal */}
                   <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl group bg-slate-200">
                      <img 
                        src={selectedProperty.images && selectedProperty.images.length > 0 ? selectedProperty.images[activeImageIndex] : selectedProperty.image} 
                        className="w-full h-full object-cover transition-opacity duration-500" 
                        alt={selectedProperty.title} 
                      />
                      
                      {/* Botões de navegação do carrossel */}
                      {selectedProperty.images && selectedProperty.images.length > 1 && (
                        <>
                          <button 
                            onClick={() => setActiveImageIndex((activeImageIndex - 1 + selectedProperty.images.length) % selectedProperty.images.length)}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 text-xl hover:bg-[#fcbf49] hover:text-white transition-all shadow-xl"
                          >
                            ←
                          </button>
                          <button 
                            onClick={() => setActiveImageIndex((activeImageIndex + 1) % selectedProperty.images.length)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 text-xl hover:bg-[#fcbf49] hover:text-white transition-all shadow-xl"
                          >
                            →
                          </button>
                        </>
                      )}
                      
                      <div className="absolute top-6 left-6">
                        <span className="bg-[#fcbf49] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">
                          {selectedProperty.type === 'sale' ? 'À Venda' : 'Para Alugar'}
                        </span>
                      </div>
                   </div>

                   {/* Miniaturas (Thumbnails) */}
                   {selectedProperty.images && selectedProperty.images.length > 1 && (
                      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                        {selectedProperty.images.map((img, idx) => (
                           <div 
                              key={idx} 
                              onClick={() => setActiveImageIndex(idx)}
                              className={`relative min-w-[100px] h-20 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${activeImageIndex === idx ? 'border-[#fcbf49] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                           >
                              <img src={img} className="w-full h-full object-cover" alt="" />
                           </div>
                        ))}
                      </div>
                   )}
                </div>

                {/* Informações do Imóvel */}
                <div className="flex flex-col justify-center">
                   <h1 className="text-5xl font-black mb-4 tracking-tight text-slate-900 leading-tight">{selectedProperty.title}</h1>
                   <div className="flex items-center gap-2 text-slate-400 font-bold mb-8 uppercase tracking-widest text-sm">
                      <span>📍</span> {selectedProperty.location}
                   </div>
                   
                   <p className="text-slate-500 text-lg leading-relaxed mb-10">{selectedProperty.description}</p>
                   
                   {/* Grid de Atributos */}
                   <div className="grid grid-cols-3 gap-6 mb-12">
                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center group">
                         <span className="text-3xl block mb-2">🚿</span>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Banh.</span>
                         <span className="text-lg font-black text-slate-900">{selectedProperty.baths}</span>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center group">
                         <span className="text-3xl block mb-2">📐</span>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Área</span>
                         <span className="text-lg font-black text-slate-900">{selectedProperty.sqft}m²</span>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center group">
                         <span className="text-3xl block mb-2">🛏️</span>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Dorm.</span>
                         <span className="text-lg font-black text-slate-900">{selectedProperty.beds}</span>
                      </div>
                   </div>

                   {/* Card de Preço e CTA */}
                   <div className="p-10 bg-slate-900 rounded-[50px] shadow-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-[#fcbf49] font-black uppercase text-[10px] block mb-2 tracking-[0.3em]">Investimento</span>
                        <h2 className="text-6xl font-black text-white mb-8 tracking-tighter">{selectedProperty.price}</h2>
                        <button 
                          onClick={() => window.open(WHATSAPP_URL, '_blank')} 
                          className="w-full bg-[#fcbf49] text-white py-6 rounded-[30px] font-black uppercase tracking-widest hover:bg-white hover:text-[#fcbf49] transition-all shadow-xl active:scale-95 text-lg"
                        >
                          Chamar no WhatsApp
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* COMPONENTES GLOBAIS */}
      <Footer onNavigate={navigateTo} />
      <AIAssistant />
      <FloatingLicense />
      {showLoginModal && <LoginModal onLogin={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

/**
 * Componente do Card de Imóvel na listagem
 */
const PropertyCard: React.FC<{ property: Property, onDetails: () => void }> = ({ property, onDetails }) => {
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : property.image;
  
  return (
    <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2" onClick={onDetails}>
      <div className="h-64 overflow-hidden relative">
        <img src={displayImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
        <div className="absolute top-4 left-4 flex gap-2">
           <span className={`bg-white/90 backdrop-blur-md text-[#fcbf49] text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg`}>
              {property.type === 'sale' ? 'Venda' : 'Aluguel'}
           </span>
           {property.featured && (
              <span className="bg-[#fcbf49] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">⭐ Destaque</span>
           )}
        </div>
        {/* Indicador de mais fotos */}
        {property.images && property.images.length > 1 && (
           <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-white font-black uppercase tracking-widest">
              +{property.images.length - 1} fotos
           </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-[#fcbf49] transition-colors">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">
          <span>📍</span> {property.location}
        </div>
        
        {/* Mini Ícones */}
        <div className="grid grid-cols-3 gap-2 mb-6 pt-4 border-t border-slate-50">
           <div className="flex flex-col items-center">
              <span className="text-base">🚿</span>
              <span className="text-[10px] font-bold text-slate-600">{property.baths}</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-base">📐</span>
              <span className="text-[10px] font-bold text-slate-600">{property.sqft}m²</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-base">🛏️</span>
              <span className="text-[10px] font-bold text-slate-600">{property.beds}</span>
           </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Investimento</span>
             <span className="font-black text-2xl text-[#fcbf49] tracking-tighter">{property.price}</span>
          </div>
          <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#fcbf49] group-hover:text-white transition-all shadow-sm">
             <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
