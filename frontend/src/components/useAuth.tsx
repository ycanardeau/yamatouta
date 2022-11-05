import { AuthContext, IAuthContext } from '@/AuthContext';
import React from 'react';

export const useAuth = (): IAuthContext => React.useContext(AuthContext);
