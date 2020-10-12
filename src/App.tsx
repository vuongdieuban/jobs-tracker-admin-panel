import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { JobApplicationManagement } from './pages/job-applications-management/JobApplicationManagement';
import { Login } from './pages/login/Login';
import { connect } from 'socket.io-client';
import { AuthenticationService } from 'api-lib/dist/services/authentication.service';
import { ApiConfig, OperationMode } from 'api-lib/dist/config';
import { AuthContext } from './shared/context/auth.context';

const mode = process.env.NODE_ENV === 'development' ? OperationMode.DEV : OperationMode.PROD;
ApiConfig.setOperationMode(mode);
// const socket = connect('wss://api.jobs-tracker.localhost');

// socket.on('connection', (data: any) => console.log('connected', data));

// socket.on('msgToClient', (data: any) => console.log('rcv from Server:', data));

// socket.emit('msgToServer');

// const authService = new AuthenticationService();

function App() {
  const history = useHistory();
  const { apiAccessToken } = useContext(AuthContext);

  useEffect(() => {
    if (apiAccessToken) {
      history.push('/applications');
    } else {
      history.push('/login');
    }
  }, [apiAccessToken]);

  return (
    <React.Fragment>
      <Switch>
        <Route path='/login' render={(props) => <Login {...props} />} />
        <Route
          path='/applications'
          render={(props) => <JobApplicationManagement {...props} apiAccessToken={apiAccessToken} />}
        />
      </Switch>
    </React.Fragment>
  );
}

export default App;
