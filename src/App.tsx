import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { CompaniesList } from './pages/CompaniesList';
import { CompanyForm } from './pages/CompanyForm';
import { CompanyDetails } from './pages/CompanyDetails';
import { ChatWidget } from './components/ChatWidget';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  // Aplica o tema inicial baseado no localStorage ou preferência do sistema
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Check if we're in widget mode
  const params = new URLSearchParams(window.location.search);
  const isWidget = window.location.pathname.includes('/widget');
  const empresaId = params.get('empresaId');

  if (isWidget && empresaId) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <ChatWidget empresaId={empresaId} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <HashRouter>
          <Routes>
            <Route path="/admin" element={<AdminLayout><Navigate to="/admin/companies" replace /></AdminLayout>} />
            <Route path="/admin/companies" element={<AdminLayout><CompaniesList /></AdminLayout>} />
            <Route path="/admin/companies/new" element={<AdminLayout><CompanyForm /></AdminLayout>} />
            <Route path="/admin/companies/:id" element={<AdminLayout><CompanyDetails /></AdminLayout>} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}