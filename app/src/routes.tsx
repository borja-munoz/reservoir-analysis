import { lazy } from 'react';
import DefaultView from './components/DefaultView';

const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const ROUTE_PATHS = {
  DEFAULT: '/',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
};

const routes = [

  // Pages with default layout (header + content)
  {
    path: ROUTE_PATHS.DEFAULT, 
    element: (
      <DefaultView />
    ),
    children: [
      { path: ROUTE_PATHS.DEFAULT, element: <HomePage /> },
      { path: ROUTE_PATHS.DASHBOARD, element: <Dashboard /> },
    ],
  },
    
  // Page Not Found
  {
    path: '*',
    element: (
      // <DefaultView>
        <NotFound />
      // </DefaultView>
    ),
  },
];

export default routes;