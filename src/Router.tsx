import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';

export const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path:'sign',
    element:<CreateAccount />
  }
];

const router = createBrowserRouter(routes);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
