
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço para conectar com a API do Google Gemini
 * Seguindo a diretriz de criar a instância no momento da chamada.
 */
export const getGeminiResponse = async (prompt: string, history: { role: string; content: string }[]) => {
  // A chave é injetada automaticamente. Se falhar, o componente de UI tratará a seleção.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Chave de API não encontrada.");
  }

  try {
    // Instanciação dentro da função para garantir o uso da chave mais recente
    const ai = new GoogleGenAI({ apiKey });
    
    const chatHistory = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Você é o Consultor Virtual oficial da Imóveis MR.
        
Contexto Institucional:
- Imobiliária: Imóveis MR.
- Gestão: Maria de Lourdes Lima (Corretora com CRECI 19855-F).
- Especialidade: Imóveis de alto padrão, luxo e conforto.
- Localização: Atuação principal em áreas nobres (casas, apartamentos e escritórios).

Seu Comportamento:
- Seja extremamente educado, sofisticado e prestativo.
- Use Português do Brasil de forma clara e profissional.
- Ajude os usuários a entenderem as categorias do site (Casas, Apartamentos, Escritórios).
- Se perguntarem sobre valores, explique que os preços são competitivos para o mercado de luxo e variam conforme a localização.
- Caso o cliente queira agendar uma visita ou tenha dúvidas específicas sobre um imóvel que você não saiba responder, direcione-o gentilmente para o WhatsApp: (11) 98605-4846.

Diretriz Importante:
- Não invente informações técnicas que não estejam no site. 
- Sua missão é converter a dúvida em um contato para a Maria de Lourdes Lima.`,
        temperature: 0.7,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "Poderia reformular sua pergunta? Estou pronto para ajudar com seu novo imóvel.";
    
  } catch (error: any) {
    console.error("Erro no Gemini Service:", error);
    throw error; // Repassa o erro para ser tratado pela UI
  }
};
