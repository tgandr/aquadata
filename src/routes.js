// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ConfirmationPage from './pages/ConfirmationPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/aquadata" element={<HomePage />} /> {/* Adiciona a rota para "/aquadata" */}
        <Route path="*" element={<HomePage />} /> {/* Adiciona uma rota de fallback */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
