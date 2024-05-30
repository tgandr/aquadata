// // src/routes.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import RegisterPage from './pages/RegisterPage';
// import ConfirmationPage from './pages/ConfirmationPage';
// import LoginPage from './pages/LoginPage';
// import MainFrame from './pages/MainFrame';

// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/confirmation" element={<ConfirmationPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/viveiros" element={<MainFrame />} />
//         <Route path="/aquadata" element={<HomePage />} />
//         <Route path="*" element={<HomePage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;

// src/routes.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import MainFrame from './pages/MainFrame'; // Certifique-se de que o caminho está correto

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/viveiros" element={<MainFrame />} /> {/* Adicionando a rota para MainFrame */}
        <Route path="/aquadata" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
