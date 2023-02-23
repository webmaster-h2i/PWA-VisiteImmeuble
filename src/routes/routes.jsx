import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/basicErrorPage';
import Home from '../views/home';
import Visite from '../views/visite';


const router = createBrowserRouter([
    {
      path: "/",
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