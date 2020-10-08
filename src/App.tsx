import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { JobApplicationManagement } from './pages/job-applications-management/JobApplicationManagement';
import { Login } from './pages/login/Login';
import { connect } from 'socket.io-client';

const socket = connect('ws://api.jobs-tracker.localhost');

socket.on('connection', (data: any) => console.log('connected', data));

socket.on('msgToClient', (data: any) => console.log('rcv from Server:', data));

socket.emit('msgToServer');

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
