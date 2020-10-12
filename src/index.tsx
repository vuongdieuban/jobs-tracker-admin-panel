import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './shared/providers/auth.provider';
import { Compose } from './shared/providers/compose.provider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Compose providers={[AuthProvider]}>
        <App />
      </Compose>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
