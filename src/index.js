import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Cria o contêiner raiz
const container = document.getElementById('root');
const root = createRoot(container);

// Renderiza o aplicativo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registrado: ', registration);
      })
      .catch(registrationError => {
        console.log('Falha no registro do ServiceWorker: ', registrationError);
      });
  });
}
