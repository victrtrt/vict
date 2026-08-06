import React from 'react';
import { useAuth, auth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav style={{ backgroundColor: '#802882', color: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl' }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>
        VICTORIA ROSE
      </div>

      {currentUser && (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>{currentUser.name} ({currentUser.province} - {currentUser.role === 'admin' ? 'مدیر کل' : currentUser.role === 'senior' ? 'مدیر ولایتی' : 'ویزیتور'})</span>
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: '#fff', color: '#802882', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            خروج
          </button>
        </div>
      )}
    </nav>
  );
};
