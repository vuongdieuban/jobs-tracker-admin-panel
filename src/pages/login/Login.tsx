import React, { useContext } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { AuthContext } from '../../shared/context/auth.context';

interface Props {}

export const Login: React.FC<Props> = (props) => {
  const { login } = useContext(AuthContext);

  const handleGoogleLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    //offline login, we not doing this
    if (response.code) return;
    if (!login) return;
    const { accessToken } = response as GoogleLoginResponse;
    await login(accessToken);
  };

  const handleGoogleLoginFailure = (error: any) => {
    console.log('Google Login Fail', error);
  };

  return (
    <React.Fragment>
      <div>Login Page</div>
      <GoogleLogin
        clientId='174667790191-1nbqlhhc9q996tp888v3p33q6qemgkib.apps.googleusercontent.com'
        buttonText='Login'
        onSuccess={handleGoogleLoginSuccess}
        onFailure={handleGoogleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
    </React.Fragment>
  );
};
