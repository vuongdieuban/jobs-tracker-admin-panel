import { AuthenticationService } from 'api-lib/dist/services/authentication.service';
import { ApiConfig } from 'api-lib/dist/config';
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { User } from '../models/user.model';

const authService = new AuthenticationService();

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiAccessToken, setApiAccessToken] = useState<string | null>(null);

  const login = async (oauthAccessToken: string) => {
    const data = await authService.login({ accessToken: oauthAccessToken });
    setUser(data.user);
    setApiAccessToken(data.accessToken);
  };

  const renewToken = async () => {
    const data = await authService.renewToken();
    setUser(data.user);
    setApiAccessToken(data.accessToken);
  };

  useEffect(() => {
    if (!apiAccessToken) return;
    ApiConfig.setAuthHeader(apiAccessToken);
  }, [apiAccessToken]);

  return (
    <AuthContext.Provider value={{ apiAccessToken, user, login, renewToken }}>
      {children}
    </AuthContext.Provider>
  );
};
