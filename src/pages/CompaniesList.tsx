import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company } from '../types/company';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      const querySnapshot = await getDocs(collection(db, 'companies'));
      const companiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
      setCompanies(companiesData);
      setLoading(false);
    }

    loadCompanies();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Empresas Cadastradas</h1>
        <Link
          to="/admin/companies/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nova Empresa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <Link
            key={company.id}
            to={`/admin/companies/${company.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
            </div>
            <div className="space-y-2 text-gray-600">
              <p><strong>Contato:</strong> {company.contact}</p>
              <p><strong>Horário:</strong> {company.businessHours}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}