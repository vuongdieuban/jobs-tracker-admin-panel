import React, { createContext } from 'react';
import { User } from '../models/user.model';

interface ContextProps {
  apiAccessToken: string;
  user: User;
  login: (oauthAccessToken: string) => Promise<void>;
}

export const AuthContext = createContext<Partial<ContextProps>>({});
