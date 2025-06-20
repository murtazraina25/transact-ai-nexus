import { ReactNode, memo } from 'react';
import { Navigate } from 'react-router-dom';
import { RootState, useAppSelector } from '@/state-management/store';

const RoleGuard = ({
  children,
  allowedUserRoles,
}: {
  children: ReactNode;
  allowedUserRoles: string[];
}) => {
  const currentUserRole = useAppSelector((state: RootState) => state.auth.role);
  return allowedUserRoles.includes(currentUserRole) ? <>{children}</> : <Navigate to={'/'} />;
};

export default memo(RoleGuard);
