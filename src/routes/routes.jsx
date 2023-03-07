import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/basicErrorPage';
import Home from '../components/home';
import Login from '../components/loginForm';
import SelectImmeuble from '../components/visite/selectImmeuble';
import LogOut from '../components/logOut';
import { ProtectedRoute } from "./protectedRoute";
import { RedirectHome } from "./redirectToHome";
import InfoGenerale from '../components/visite/infoGenerale';

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
      element: <ProtectedRoute><Home /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/visite",
      element: <ProtectedRoute><SelectImmeuble /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/info",
      element: <ProtectedRoute><InfoGenerale /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
]);

export default router;