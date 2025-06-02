import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import AddPonds from './pages/AddPonds'; 
import PondDetail from './pages/PondDetail';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Financial from './pages/Financial';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AnalysisReport from './pages/AnalysisReport';
import Inventory from './pages/Inventory';
import ReportCycle from './pages/ReportCycle';
import ReportFinancial from './pages/ReportFinancial';
import ReportCosts from './pages/ReportCosts';
import ProfilePage from './pages/ProfilePage';
import PondCosts from './pages/PondCosts';
import SplashScreen from './pages/SplashScreen';
import AddManagerPage from './pages/AddManagerPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/viveiros" element={<AddPonds />} />
        <Route path="/viveiro/:id" element={<PondDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estoque" element={<Stock />} />
        <Route path="/financeiro" element={<Financial />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/relatorio" element={<ReportCycle />} />
        <Route path="/meses" element={<ReportFinancial />} />
        <Route path="/custos" element={<ReportCosts />} />
        <Route path="/custos/:id" element={<PondCosts />} />
        <Route path="/sanidade" element={<AnalysisReport />} />
        <Route path="/aquadata" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/splash-screen" element={<SplashScreen/>}></Route>
        <Route path="/registrar-gerente" element={<AddManagerPage/>}></Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
