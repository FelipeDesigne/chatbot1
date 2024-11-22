import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company } from '../types/company';
import { Building2, Clock, Phone, FileText, HeartHandshake, Trash2, Edit, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Partial<Company>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      if (!id) return;
      
      const docRef = doc(db, 'companies', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const companyData = { id: docSnap.id, ...docSnap.data() } as Company;
        setCompany(companyData);
        setEditedCompany(companyData);
      }
      setLoading(false);
    }

    loadCompany();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Tem certeza que deseja excluir esta empresa?')) return;
    
    try {
      await deleteDoc(doc(db, 'companies', id));
      navigate('/admin/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Erro ao excluir empresa');
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    
    try {
      const docRef = doc(db, 'companies', id);
      await updateDoc(docRef, editedCompany);
      setCompany({ ...company, ...editedCompany } as Company);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Erro ao atualizar empresa');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedCompany(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Generate embed code
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
            empresaId: '${id}',
            container: 'chatbot-container'
        });
    };
    document.head.appendChild(script);
})();
</script>
<div id="chatbot-container"></div>
<!-- Fim do ChatBot -->`;

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!company) {
    return <div>Empresa não encontrada</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedCompany.name}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-800 border rounded px-2"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-700">Horário de Funcionamento</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="businessHours"
                  value={editedCompany.businessHours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-600">{company.businessHours}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HeartHandshake className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-700">Serviços</h2>
              {isEditing ? (
                <textarea
                  name="services"
                  value={editedCompany.services}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{company.services}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-700">Política de Atendimento</h2>
              {isEditing ? (
                <textarea
                  name="supportPolicy"
                  value={editedCompany.supportPolicy}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">{company.supportPolicy}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-700">Contato</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={editedCompany.contact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-600">{company.contact}</p>
              )}
            </div>
          </div>
        </div>

        {/* Integration Code Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Código de Integração</h2>
          <div className="relative">
            <SyntaxHighlighter 
              language="html" 
              style={tomorrow}
              className="rounded-lg"
            >
              {embedCode}
            </SyntaxHighlighter>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}