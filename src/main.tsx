import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router';
import Context from './Context';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Context>
      <Router />
    </Context>
  </React.StrictMode>
);
