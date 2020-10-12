import React, { useContext, useEffect, useState } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth.context';

interface Props {}

export const Login: React.FC<Props> = (props) => {
  const [loginRequired, setLoginRequired] = useState(false);
  const { login, renewToken, apiAccessToken } = useContext(AuthContext);
  const location = useLocation<any>();
  const history = useHistory();

  const handleGoogleLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    //offline login, we not doing this
    if (response.code) return;
    const { accessToken } = response as GoogleLoginResponse;
    await login(accessToken);
  };

  const handleGoogleLoginFailure = (error: any) => {
    console.log('Google Login Fail', error);
  };

  const handleApiAuthSuccess = () => {
    setLoginRequired(false);
    const path = location.state ? location.state.from.pathname : '/applications'; // redirect to previous location
    history.push(path);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        await renewToken();
        handleApiAuthSuccess();
      } catch (err) {
        setLoginRequired(true);
      }
    };

    if (apiAccessToken) {
      handleApiAuthSuccess();
      return;
    }

    fetchToken();
  }, [apiAccessToken]);

  return (
    <React.Fragment>
      <div>Login Page</div>
      {loginRequired && (
        <GoogleLogin
          clientId='174667790191-1nbqlhhc9q996tp888v3p33q6qemgkib.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          cookiePolicy={'single_host_origin'}
        />
      )}
    </React.Fragment>
  );
};
