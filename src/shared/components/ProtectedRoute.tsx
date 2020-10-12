import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

interface Props extends RouteProps {
  component: React.FC;
}

export const ProtectedRoute: React.FC<Props> = (props) => {
  // component need to capitalize so react know its a Component
  const { path, component: Component, ...rest } = props;
  const { apiAccessToken } = useContext(AuthContext);
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        if (!apiAccessToken)
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        return <Component />;
      }}
    />
  );
};
