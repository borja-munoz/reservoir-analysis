import { lazy } from 'react';
import Header from './components/Header';
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

  // Pages without sidebar  
  { 
    path: ROUTE_PATHS.DEFAULT, 
    element: (
      <>
        <Header />
        <HomePage /> 
      </>
    )
  },

  // Pages with default layout (header + sidebar)
  {
    path: ROUTE_PATHS.DEFAULT, 
    element: (
      <DefaultView />
    ),
    children: [
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