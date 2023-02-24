import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/basicErrorPage';
import Home from '../views/home';
import Login from '../views/login';
import Visite from '../views/visite';
import { ProtectedRoute } from "./protectedRoute";
import { RedirectHome } from "./redirectToHome";

const router = createBrowserRouter([
    {
      path: "/",
      element: <RedirectHome><Login /></RedirectHome>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/accueil",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/immeubles",
      element: <ProtectedRoute><Visite /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
]);

export default router;