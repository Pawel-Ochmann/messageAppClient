import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './pages/app/App';
import Login from './pages/login/Login';
import CreateAccount from './pages/createAccount/CreateAccount';

export const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign',
    element: <CreateAccount />,
  },
];

const router = createBrowserRouter(routes);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
