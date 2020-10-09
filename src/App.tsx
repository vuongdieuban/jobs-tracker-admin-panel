import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { JobApplicationManagement } from './pages/job-applications-management/JobApplicationManagement';
import { Login } from './pages/login/Login';
import { connect } from 'socket.io-client';
import {AuthenticationService } from 'api-lib/dist/services/authentication.service'

const socket = connect('ws://api.jobs-tracker.localhost');

socket.on('connection', (data: any) => console.log('connected', data));

socket.on('msgToClient', (data: any) => console.log('rcv from Server:', data));

socket.emit('msgToServer');

const authService = new AuthenticationService();
const login = async () => {
  const data = await authService.login({
    accessToken:"ya29.a0AfH6SMC45E-H3yKTlTkXnrHmG2vJc2p2T93E_uNYrZHnKrxmYYEgNnIulkcnRwFxwlqgWsSFUEHM0FOIpDOFlBcgi-EVOVskknb1x-SWF-3EmFmg0Vz-tqve84WqrvkppsgdSlkaytfRFreBNmeNNMj1SroS0nRvznmR"
  });
  console.log("login data", data);
}
login();

function App() {
  const history = useHistory();
  const [apiAccessToken, setApiAccessToken] = useState<string | null>();

  useEffect(() => {
    history.push('/applications');
  }, []);

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
