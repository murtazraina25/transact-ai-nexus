import React from 'react';
import { Navigate } from 'react-router-dom';

import { RootState, useAppSelector } from '@/state-management/store';
import { AuthState } from '@/types/models/auth';

const AuthGuard: React.FC<{ children: React.ReactNode; authenticate?: boolean }> = ({
  children,
  authenticate,
}) => {
  const userDetails: AuthState = useAppSelector((state: RootState) => state.auth);
  const { email } = userDetails;

  if (authenticate) {
    return email ? children : <Navigate to={'/'} replace={true} />;
  }
  return !email ? children : <Navigate to={'/dashboard'} replace={true} />;
};

export default AuthGuard;
