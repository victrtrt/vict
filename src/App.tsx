import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { VisitReportForm } from './components/forms/VisitReportForm';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div style={{ fontFamily: 'B Lotus, Tahoma, sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        <Navbar />
        <main style={{ padding: '20px' }}>
          <ProtectedRoute allowedRoles={['visitor', 'senior', 'admin']}>
            <VisitReportForm />
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
