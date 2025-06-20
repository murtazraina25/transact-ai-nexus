
import React from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state-management/store';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { AuthProvider } from './components/auth/UserAuthContext'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
     </PersistGate>
    </Provider>
  </React.StrictMode>
);
