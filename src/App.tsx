import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { CompaniesList } from './pages/CompaniesList';
import { CompanyForm } from './pages/CompanyForm';
import { CompanyDetails } from './pages/CompanyDetails';
import { ChatWidget } from './components/ChatWidget';

export default function App() {
  // Check if we're in widget mode
  const isWidget = window.location.pathname === '/widget';

  if (isWidget) {
    return <ChatWidget />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout><Navigate to="/admin/companies" replace /></AdminLayout>} />
        <Route path="/admin/companies" element={<AdminLayout><CompaniesList /></AdminLayout>} />
        <Route path="/admin/companies/new" element={<AdminLayout><CompanyForm /></AdminLayout>} />
        <Route path="/admin/companies/:id" element={<AdminLayout><CompanyDetails /></AdminLayout>} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </HashRouter>
  );
}