import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
// import '@wcj/dark-mode';
import './index.css';
import Home from './Home';
import Color from './routes/Color';
import Palettes from './routes/Palettes';
import ErrorPage from './ErrorPage';

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
