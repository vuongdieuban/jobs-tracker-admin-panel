import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { JobApplicationManagement } from './pages/job-applications-management/JobApplicationManagement';
import { Login } from './pages/login/Login';
import { ApiConfig, OperationMode } from 'api-lib/dist/config';
import { ProtectedRoute } from './shared/components/ProtectedRoute';

const mode = process.env.NODE_ENV === 'development' ? OperationMode.DEV : OperationMode.PROD;
ApiConfig.setOperationMode(mode); // setting base url for other services before use

// const socket = connect('wss://api.jobs-tracker.localhost');

// socket.on('connection', (data: any) => console.log('connected', data));

// socket.on('msgToClient', (data: any) => console.log('rcv from Server:', data));

// socket.emit('msgToServer');

// const authService = new AuthenticationService();
function App() {
  return (
    <React.Fragment>
      <Switch>
        <ProtectedRoute exact path='/applications' component={JobApplicationManagement} />
        <Route exact path='/login' component={Login} />
        <Redirect from='/' exact to='/applications' />
      </Switch>
    </React.Fragment>
  );
}

export default App;
