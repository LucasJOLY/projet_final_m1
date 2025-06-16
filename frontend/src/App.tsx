import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import AuthGuard from './auth/security/AuthGuard';
import ResetPassword from './auth/ResetPassword';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />

      {/* Routes protégées */}
      <Route path='/' element={<AuthGuard Component={MainLayout} />}>
        <Route index element={<Navigate to='/dashboard' replace />} />
        <Route path='dashboard' element={<div>Dashboard</div>} />
        <Route path='clients' element={<div>Clients</div>} />
        <Route path='projects' element={<div>Projets</div>} />
        <Route path='invoices' element={<div>Factures</div>} />
        <Route path='users' element={<div>Utilisateurs</div>} />
      </Route>

      {/* Route par défaut */}
      <Route path='*' element={<Navigate to='/' replace />} />

      {/* Nouvelles routes */}
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/reset-password' element={<NotFound />} />
    </Routes>
  );
};

export default App;
