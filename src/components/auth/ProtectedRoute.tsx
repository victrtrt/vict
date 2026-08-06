import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>در حال بارگذاری...</div>;
  }

  if (!currentUser) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>لطفاً ابتدا وارد حساب کاربری خود شوید.</div>;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>شما دسترسی به این بخش را ندارید.</div>;
  }

  return <>{children}</>;
};
