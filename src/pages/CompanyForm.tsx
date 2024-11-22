import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CompanyForm() {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: '',
    businessHours: '',
    services: '',
    supportPolicy: '',
    contact: ''
  });
  const [showCode, setShowCode] = useState(false);
  const [companyId, setCompanyId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const docRef = await addDoc(collection(db, 'companies'), {
        ...company,
        createdAt: new Date()
      });
      
      setCompanyId(docRef.id);
      setShowCode(true);
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompany(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // This will be replaced with the actual domain when deployed
  const getScriptUrl = () => {
    const scriptUrl = new URL('/chatbot.js', window.location.origin);
    return scriptUrl.href;
  };

  const embedCode = `<!-- Início do ChatBot -->
<script>
(function() {
    var script = document.createElement('script');
    script.src = "${getScriptUrl()}";
    script.onload = function() {
        new ChatBot({
            empresaId: '${companyId}',
            container: 'chatbot-container'
        });
    };
    document.head.appendChild(script);
})();
</script>
<div id="chatbot-container"></div>
<!-- Fim do ChatBot -->`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {showCode ? 'Código de Integração' : 'Nova Empresa'}
      </h1>

      {!showCode ? (
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                name="businessHours"
                value={company.businessHours}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviços
              </label>
              <textarea
                name="services"
                value={company.services}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Política de Atendimento
              </label>
              <textarea
                name="supportPolicy"
                value={company.supportPolicy}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contato
              </label>
              <input
                type="text"
                name="contact"
                value={company.contact}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Cadastrar Empresa
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4 text-gray-600">
            Copie e cole este código no seu site onde você deseja que o chatbot apareça:
          </p>
          
          <SyntaxHighlighter 
            language="html" 
            style={tomorrow}
            className="rounded-lg"
          >
            {embedCode}
          </SyntaxHighlighter>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate('/admin/companies')}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Voltar para Lista
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                alert('Código copiado!');
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Copiar Código
            </button>
          </div>
        </div>
      )}
    </div>
  );
}