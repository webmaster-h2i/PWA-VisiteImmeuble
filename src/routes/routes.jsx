import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/basicErrorPage';
import Home from '../views/home';
import Login from '../views/login';
import Visite from '../views/visite';
import LogOut from '../components/logOut';
import { ProtectedRoute } from "./protectedRoute";
import { RedirectHome } from "./redirectToHome";

const router = createBrowserRouter([
    {
      path: "/",
      element: <RedirectHome><Login /></RedirectHome>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/logout",
      element: <LogOut/>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/accueil",
      element: <Home />,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/immeubles",
      element: <Visite />,
      errorElement: <BasicErrorPage />,
    },
]);

export default router;