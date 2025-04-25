import { createRoot } from 'react-dom/client'
import './index.css'
// import "reflect-metadata";
import App from './App.jsx'
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)