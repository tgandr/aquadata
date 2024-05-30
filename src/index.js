// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import Routes from './routes';
// import './styles/App.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// ReactDOM.render(
//   <React.StrictMode>
//     <Routes />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// src/index.js
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
