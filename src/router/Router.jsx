import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import SignInPage from "../pages/auth/SignInPage.jsx";
import SignUpPage from "../pages/auth/SignUpPage.jsx";
import ProtectedPage from "../pages/ProtectedPage.jsx";
import NotFoundPage from "../pages/404Page.jsx";
import AuthProtectedRoute from "./AuthProtectedRoute.jsx";
import Providers from "../Providers.jsx";
// my stuff
import ColorPage from '../pages/ColorPage.jsx';
import Palettes from '../pages/PalettesPage.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import AuthOTP from '../pages/auth/AuthOTP.jsx';

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth/sign-in",
        element: <AuthOTP />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/synthesia",
        element: <ColorPage />,
      },
      {
        path: "/palettes",
        element: <Palettes />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <ProtectedPage />,
          },
          {
            path: "/profile",
            element: <AccountPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;