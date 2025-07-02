import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import AuthGuard from './auth/security/AuthGuard';
import ResetPassword from './auth/ResetPassword';
import NotFound from './pages/NotFound';
import Profile from './profile/Profile';
import Clients from './clients/Clients';
import AddClient from './clients/AddClient';
import EditClient from './clients/EditClient';
import ClientView from './clients/ClientView';
import Projects from './projects/Projects';
import AddProject from './projects/AddProject';
import EditProject from './projects/EditProject';
import ProjectView from './projects/ProjectView';
import { AddQuote, EditQuote, QuoteView } from './quotes';
import Invoices from './invoices/Invoices';
import InvoiceView from './invoices/InvoiceView';
import AddInvoice from './invoices/AddInvoice';
import EditInvoice from './invoices/EditInvoice';
import AccountsAdminGuard from './accountAdmin/security/AccountsAdminGuard';
import AccountsList from './accountAdmin/AccountsList';
import AccountView from './accountAdmin/AccountView';
import { Dashboard } from './dashboard';

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
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='clients' element={<Clients />} />
        <Route path='clients/add' element={<AddClient />} />
        <Route path='clients/:id' element={<ClientView />} />
        <Route path='clients/:id/edit' element={<EditClient />} />
        <Route path='projects' element={<Projects />} />
        <Route path='projects/add' element={<AddProject />} />
        <Route path='projects/:id' element={<ProjectView />} />
        <Route path='projects/:id/edit' element={<EditProject />} />
        <Route path='quotes/:id' element={<QuoteView />} />
        <Route path='quotes/:id/edit' element={<EditQuote />} />
        <Route path='quotes/add/:client_id' element={<AddQuote />} />
        <Route path='invoices/add/:client_id' element={<AddInvoice />} />
        <Route path='invoices/:id' element={<InvoiceView />} />
        <Route path='invoices/:id/edit' element={<EditInvoice />} />
        <Route path='invoices' element={<Invoices />} />
        <Route path='profile' element={<Profile />} />
        <Route path='accounts' element={<AccountsAdminGuard Component={AccountsList} />} />
        <Route path='accounts/:id' element={<AccountsAdminGuard Component={AccountView} />} />
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
