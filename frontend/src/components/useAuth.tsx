import React from 'react';

import { AuthContext, IAuthContext } from '../AuthContext';

export const useAuth = (): IAuthContext => React.useContext(AuthContext);
