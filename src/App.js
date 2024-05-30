import React from 'react';
import './App.css';
import Routes from './routes';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Adicione ícones ao pacote (você pode adicionar apenas os ícones que for usar)
library.add(fas, fab);


function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
