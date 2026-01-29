
/**
 * Definições de tipos para o projeto Imóveis MR
 */

// Interface que define a estrutura de um imóvel
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string; // Imagem principal (para miniatura)
  images: string[]; // Lista de até 5 imagens para o carrossel
  type: 'sale' | 'rent'; // Venda ou Aluguel
  status: 'available' | 'sold' | 'rented'; // Disponível, Vendido ou Alugado
  featured: boolean; // Se aparece nos destaques
  category: string; // Ex: Casas, Apartamentos
  description: string; // Descrição detalhada
}

// Interface para as categorias de imóveis
export interface Category {
  id: string;
  name: string;
  image: string;
}

// Interface para as mensagens do chat com IA
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
