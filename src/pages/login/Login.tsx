import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Subscription } from 'rxjs';

interface Props {
  setApiAccessToken: Dispatch<SetStateAction<string | null>>;
}

export const Login: React.FC<Props> = (props) => {
  const subscriptions: Subscription[] = [];

  useEffect(() => {
    return () => subscriptions.forEach((s) => s.unsubscribe());
  }, []);

  const handleLoginSuccess = () => {};

  const handleLoginFailure = () => {};

  return (
    <React.Fragment>
      <div>Login Page</div>
      <GoogleLogin
        clientId='174667790191-1nbqlhhc9q996tp888v3p33q6qemgkib.apps.googleusercontent.com'
        buttonText='Login'
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
    </React.Fragment>
  );
};
