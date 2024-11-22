import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, List, Plus } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">ChatBot Admin</h1>
        </div>
        <nav className="p-4">
          <Link
            to="/admin/companies"
            className={`flex items-center gap-2 p-2 rounded-lg ${
              location.pathname === '/admin/companies'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List size={20} />
            <span>Empresas</span>
          </Link>
          <Link
            to="/admin/companies/new"
            className={`flex items-center gap-2 p-2 rounded-lg ${
              location.pathname === '/admin/companies/new'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Plus size={20} />
            <span>Nova Empresa</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}