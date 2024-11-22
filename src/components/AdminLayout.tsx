import { Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="text-xl font-bold text-gray-800 dark:text-white">
                  ChatBot1
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  to="/admin/companies"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                >
                  <Building2 className="w-5 h-5 mr-1" />
                  Empresas
                </Link>
                <Link
                  to="/admin/companies/new"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Nova Empresa
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}