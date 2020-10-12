import { AuthenticationService } from 'api-lib/dist/services/authentication.service';
import { ApiConfig } from 'api-lib/dist/config';
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { User } from '../models/user.model';

const authService = new AuthenticationService();

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [apiAccessToken, setApiAccessToken] = useState<string>();

  const login = async (oauthAccessToken: string) => {
    const result = await authService.login({ accessToken: oauthAccessToken });
    setUser(result.user);
    setApiAccessToken(result.accessToken);
  };

  useEffect(() => {
    if (apiAccessToken) {
      ApiConfig.setAuthHeader(apiAccessToken);
    }
  }, [apiAccessToken]);

  return <AuthContext.Provider value={{ apiAccessToken, user, login }}>{children}</AuthContext.Provider>;
};
