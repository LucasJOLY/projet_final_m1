import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import AuthGuard from './auth/security/AuthGuard';

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
        <Route path='profile' element={<div>Profil</div>} />
        <Route path='settings' element={<div>Paramètres</div>} />
      </Route>

      {/* Route par défaut */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
