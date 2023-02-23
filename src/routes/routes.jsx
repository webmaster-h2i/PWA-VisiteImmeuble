import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/basicErrorPage';
import Home from '../views/home';
import Visite from '../views/visite';
import { ProtectedRoute } from "./protectedRoute";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/immeubles",
      element: <ProtectedRoute><Visite /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
]);

export default router;