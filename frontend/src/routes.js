import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import NewPage from './pages/NewPage';
import AddSOA from './pages/AddSOA';
import AddInvoice from './pages/AddInvoice';
import IndividualInvoice from './pages/IndividualInvoice';
import IndividualSOA from './pages/IndividualSOA';
import AddPayment from "./pages/AddPayment";
import AddSupplier from "./pages/AddSupplier";
import AddProduct from './pages/AddProduct';
import RegistrationPage from './pages/RegistrationPage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'add-soa', element: <AddSOA /> },
        { path: 'add-invoice', element: <AddInvoice /> },
        { path: "add-payment", element: <AddPayment /> },
        { path: "add-supplier", element: <AddSupplier /> },
        { path: "add-product", element: <AddProduct /> },
        { path: 'user', element: <UserPage /> },
        { path: 'new-page', element: <NewPage /> },
        { path: 'invoice/:invoiceId', element: <IndividualInvoice /> },
        { path: 'statement-of-account/:soaId', element: <IndividualSOA /> }
      ],
    },
    {
      path: 'registration',
      element: <RegistrationPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="404" />,
    },
  ]);

  return routes;
}
