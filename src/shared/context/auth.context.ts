import { createContext } from 'react';
import { User } from '../models/user.model';

interface ContextProps {
  apiAccessToken: string | null;
  user: User | null;
  login: (oauthAccessToken: string) => Promise<void>; // Implementation in AuthProvider
  renewToken: () => Promise<void>;
}

export const AuthContext = createContext<ContextProps>({
  apiAccessToken: null,
  user: null,
  login: async (token: string) => {},
  renewToken: async () => {},
});
