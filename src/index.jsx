import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Home';
import Auth from './Auth'
import Account from './Account'
import Color from './routes/Color';
import Palettes from './routes/Palettes';
import ErrorPage from './ErrorPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/synthesia/",
    element: <Color />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/synthesia/color",
    element: <Color />,
  },
  {
    path: "/synthesia/palettes/",
    element: <Palettes />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
