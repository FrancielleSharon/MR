
import React, { useState, useEffect } from 'react';

interface Props {
  onLogin: () => void;
  onClose: () => void;
}

// CHAVE DE SEGURANÇA PARA O PRIMEIRO ACESSO
// Mude esta chave se desejar algo mais complexo
const INSTALLATION_KEY = "MR-ADMIN-2025";

export const LoginModal: React.FC<Props> = ({ onLogin, onClose }) => {
  // Estados para controlar se estamos logando ou registrando
  const [isRegistering, setIsRegistering] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  
  // Campos do formulário
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [securityKey, setSecurityKey] = useState(''); // Chave para validar o registro único

  // Verifica se já existe um admin cadastrado no sistema assim que o modal abre
  useEffect(() => {
    const saved = localStorage.getItem('mr_master_creds');
    if (saved) {
      setAdminExists(true);
      setIsRegistering(false); // Garante que caia no login se já existir admin
    } else {
      setAdminExists(false);
      setIsRegistering(true); // Se não existir ninguém, força a tela de setup inicial
    }
  }, []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica para Criar o Único Administrador (Setup Inicial)
    if (isRegistering) {
      if (!user || !pass || !securityKey) {
        return alert('Por favor, preencha todos os campos para o setup de segurança!');
      }

      // Valida a chave de instalação para impedir que estranhos criem a conta
      if (securityKey !== INSTALLATION_KEY) {
        return alert('Chave de Segurança de Instalação incorreta! Você não tem autorização para configurar este painel.');
      }

      // Salva as credenciais permanentes no navegador
      localStorage.setItem('mr_master_creds', JSON.stringify({ user, pass }));
      
      alert('Administrador Mestre configurado com sucesso! Agora você pode fazer login.');
      
      setAdminExists(true);
      setIsRegistering(false);
      setUser('');
      setPass('');
      setSecurityKey('');
    } 
    // Lógica de Login Comum
    else {
      const saved = localStorage.getItem('mr_master_creds');
      if (saved) {
        const { user: sUser, pass: sPass } = JSON.parse(saved);
        if (user === sUser && pass === sPass) {
          onLogin();
        } else {
          alert('Acesso Negado: Usuário ou Senha incorretos.');
          setPass('');
        }
      } else {
        // Caso de erro raro onde o admin some do storage
        alert('Erro crítico: Nenhum administrador encontrado. Recarregue a página.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Fundo escurecido com blur */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Caixa do Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[50px] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        <div className="p-12">
          
          {/* Cabeçalho */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#fcbf49] rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-2xl shadow-[#fcbf49]/30">
              M
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Setup Mestre' : 'Acesso Restrito'}
            </h2>
            <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">
              {isRegistering ? 'Configuração Inicial de Segurança' : 'Painel de Controle MR'}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleAction} className="space-y-5">
            <div>
              <input 
                type="text" 
                value={user} 
                onChange={e => setUser(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-[#fcbf49] font-bold text-slate-700 transition-all" 
                placeholder="Usuário Administrador" 
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                value={pass} 
                onChange={e => setPass(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-[#fcbf49] font-bold text-slate-700 transition-all" 
                placeholder="Senha" 
                required
              />
            </div>

            {/* Este campo só aparece no registro inicial */}
            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-2">
                  <p className="text-[10px] text-red-500 font-bold uppercase text-center">Chave de Segurança Necessária</p>
                </div>
                <input 
                  type="password" 
                  value={securityKey} 
                  onChange={e => setSecurityKey(e.target.value)}
                  className="w-full p-5 bg-red-50 border border-red-100 rounded-2xl outline-none focus:ring-2 ring-red-400 font-bold text-slate-700 transition-all text-center" 
                  placeholder="Digite a Chave Mestra"
                  required
                />
              </div>
            )}

            <button type="submit" className="w-full bg-[#fcbf49] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#fcbf49]/20 hover:bg-slate-900 transition-all transform active:scale-95">
              {isRegistering ? 'Criar Acesso Único' : 'Entrar no Sistema'}
            </button>

            {/* O botão de "Criar conta" só aparece se NENHUM admin existir no sistema */}
            {!adminExists && !isRegistering && (
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)}
                className="w-full text-slate-400 font-bold text-[10px] py-2 uppercase tracking-widest hover:text-[#fcbf49] transition-all"
              >
                Primeiro Acesso? Configurar Agora
              </button>
            )}

            {/* Aviso de Segurança */}
            {!isRegistering && (
              <p className="text-center text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-4">
                Sistema monitorado. Apenas pessoal autorizado.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
