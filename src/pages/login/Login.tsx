import React, { useEffect } from 'react';
import { Subscription } from 'rxjs';

function Login(props: any) {
  const subscriptions: Subscription[] = [];

  useEffect(() => {
    return () => subscriptions.forEach((s) => s.unsubscribe());
  }, []);

  const requestLoginFromBackground = () => {};

  return (
    <React.Fragment>
      <div>Login Page</div>
      <button onClick={requestLoginFromBackground}>Login</button>
    </React.Fragment>
  );
}

export { Login };
