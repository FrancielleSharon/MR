
import React, { useState, useRef } from 'react';
import { Property, Category } from '../types';

/**
 * Painel Administrativo - Gestão MR
 * Aqui o corretor gerencia imóveis, fotos e categorias.
 */

interface Props {
  properties: Property[];
  categories: Category[];
  heroImage: string;
  onAddProperty: (p: Property) => void;
  onRemoveProperty: (id: string) => void;
  onUpdateStatus: (id: string, status: 'available' | 'sold' | 'rented') => void;
  onToggleFeatured: (id: string) => void;
  onUpdateHeroImage: (url: string) => void;
  onAddCategory: (c: Category) => void;
  onRemoveCategory: (id: string) => void;
  onCancel: () => void;
}

export const AdminPanel: React.FC<Props> = ({ 
  properties, categories, heroImage, onAddProperty, onRemoveProperty, 
  onUpdateStatus, onToggleFeatured, onUpdateHeroImage, onAddCategory, onRemoveCategory, onCancel 
}) => {
  // Estado para controlar qual aba estamos vendo
  const [view, setView] = useState<'add' | 'list' | 'settings' | 'categories'>('add');
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Dados do formulário para o novo imóvel
  const [formData, setFormData] = useState({
    title: '', price: '', location: '', beds: 1, baths: 1, sqft: 50, images: [] as string[], type: 'sale' as 'sale' | 'rent', category: categories[0]?.name || 'Casas', description: '', featured: true
  });
  
  // Dados para criar uma nova categoria
  const [catData, setCatData] = useState({ name: '', image: '' });
  
  // Referências para abrir o seletor de arquivos do computador
  const fileInputRef = useRef<HTMLInputElement>(null);
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // Função para ler as imagens do imóvel (máximo 5)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 5 - formData.images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove uma imagem específica do novo imóvel
  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Lê a imagem para a nova categoria
  const handleCatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCatData({ ...catData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // Salva o imóvel no sistema
  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) return alert('Adicione pelo menos 1 foto!');
    onAddProperty({ 
      ...formData, 
      id: Date.now().toString(), 
      status: 'available',
      image: formData.images[0] // A primeira foto vira a principal
    });
    alert('Imóvel cadastrado com sucesso!');
    onCancel();
  };

  // Salva a nova categoria
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catData.image) return alert('Escolha uma foto para a categoria!');
    onAddCategory({ ...catData, id: Date.now().toString() });
    setCatData({ name: '', image: '' });
    alert('Categoria adicionada!');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Menu Superior do Painel */}
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#fcbf49] rounded-xl flex items-center justify-center font-black text-xl">M</div>
             <h1 className="text-2xl font-black">Gestão MR</h1>
          </div>
          <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl gap-1">
            <button onClick={() => setView('add')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${view === 'add' ? 'bg-[#fcbf49] text-white' : 'text-slate-400'}`}>Novo Imóvel</button>
            <button onClick={() => setView('categories')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${view === 'categories' ? 'bg-[#fcbf49] text-white' : 'text-slate-400'}`}>Categorias</button>
            <button onClick={() => setView('list')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${view === 'list' ? 'bg-[#fcbf49] text-white' : 'text-slate-400'}`}>Catálogo</button>
            <button onClick={() => setView('settings')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${view === 'settings' ? 'bg-[#fcbf49] text-white' : 'text-slate-400'}`}>Aparência</button>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Fechar</button>
        </div>

        <div className="p-10">
          
          {/* TELA: ADICIONAR NOVO IMÓVEL */}
          {view === 'add' && (
            <form onSubmit={handleSaveProperty} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-12">
                
                {/* Lado Esquerdo: Fotos e Local */}
                <div className="space-y-6">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block border-b pb-2">Fotos (Até 5)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
                      </div>
                    ))}
                    {formData.images.length < 5 && (
                      <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="text-2xl text-slate-300">+</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImagesChange} className="hidden" />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Endereço / Bairro</label>
                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-[#fcbf49] outline-none font-bold" placeholder="Ex: Itaim Bibi, São Paulo" />
                  </div>
                </div>

                {/* Lado Direito: Atributos principais */}
                <div className="space-y-6">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block border-b pb-2">Informações Básicas</label>
                  
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" placeholder="Título do Anúncio" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase ml-2">Preço Sugerido</label>
                      <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" placeholder="R$ 1.500.000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase ml-2">Tipo de Negócio</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold">
                        <option value="sale">Venda</option>
                        <option value="rent">Aluguel</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantidade de Banheiros, Metros e Quartos */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase text-center block">Banheiros</label>
                      <input type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 rounded-2xl border-none text-center font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase text-center block">Metro (m²)</label>
                      <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 rounded-2xl border-none text-center font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-300 uppercase text-center block">Quartos</label>
                      <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: parseInt(e.target.value) || 0})} className="w-full p-4 bg-slate-50 rounded-2xl border-none text-center font-bold" />
                    </div>
                  </div>

                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>

                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none h-24 outline-none font-medium resize-none" placeholder="Descrição do imóvel..."></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fcbf49] text-white py-6 rounded-3xl font-black uppercase text-lg shadow-xl hover:bg-slate-900 transition-all">Publicar Imóvel</button>
            </form>
          )}

          {/* TELA: GERENCIAR CATEGORIAS */}
          {view === 'categories' && (
            <div className="grid md:grid-cols-2 gap-16">
              {/* Formulário para Nova Categoria */}
              <div className="space-y-8">
                <h3 className="text-xl font-black border-b pb-3">Adicionar Categoria</h3>
                <form onSubmit={handleSaveCategory} className="space-y-6">
                  <div onClick={() => catFileInputRef.current?.click()} className="h-48 bg-slate-50 border-2 border-dashed rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden group">
                    {catData.image ? <img src={catData.image} className="w-full h-full object-cover" alt="" /> : <span className="text-slate-300 font-bold">Clique para adicionar foto</span>}
                  </div>
                  <input ref={catFileInputRef} type="file" accept="image/*" onChange={handleCatImageChange} className="hidden" />
                  <input required type="text" value={catData.name} onChange={e => setCatData({...catData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Nome da Categoria (Ex: Sítios)" />
                  <button type="submit" className="w-full bg-[#fcbf49] text-white py-4 rounded-2xl font-black uppercase shadow-lg">Criar Categoria</button>
                </form>
              </div>

              {/* Lista de Categorias Atuais */}
              <div className="space-y-6">
                <h3 className="text-xl font-black border-b pb-3">Categorias Existentes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map(c => (
                    <div key={c.id} className="relative h-32 rounded-2xl overflow-hidden group">
                      <img src={c.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                        <span className="text-white font-black text-xs uppercase tracking-widest">{c.name}</span>
                        <button onClick={() => onRemoveCategory(c.id)} className="mt-2 bg-red-500 text-white text-[8px] px-2 py-1 rounded uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity">Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELA: CATÁLOGO DE IMÓVEIS (LISTA PARA GERENCIAR) */}
          {view === 'list' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black mb-8">Todos os Imóveis</h2>
              {properties.map(p => (
                <div key={p.id} className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <img src={p.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                  <div className="flex-grow">
                    <h4 className="font-black text-slate-900">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.location} • {p.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onToggleFeatured(p.id)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase ${p.featured ? 'bg-[#fcbf49] text-white' : 'bg-white text-slate-400 border'}`}>
                      {p.featured ? 'Destaque: Sim' : 'Destaque: Não'}
                    </button>
                    <button onClick={() => onRemoveProperty(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[8px] font-black uppercase">Excluir</button>
                  </div>
                </div>
              ))}
              {properties.length === 0 && <p className="text-center py-20 text-slate-400 font-bold italic">Nenhum imóvel cadastrado.</p>}
            </div>
          )}

          {/* TELA: ALTERAR CAPA DO SITE (HERO) */}
          {view === 'settings' && (
            <div className="max-w-xl mx-auto py-10 space-y-8">
              <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                {/* Fixed: Use heroImage prop instead of undefined newHeroUrl */}
                <img src={heroImage} className="w-full h-full object-cover" alt="" />
              </div>
              <button onClick={() => heroInputRef.current?.click()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Escolher Nova Foto de Capa</button>
              <input ref={heroInputRef} type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const r = new FileReader();
                  r.onloadend = () => {
                    onUpdateHeroImage(r.result as string);
                    alert('Capa atualizada com sucesso!');
                  };
                  r.readAsDataURL(file);
                }
              }} className="hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
