import { createBrowserRouter } from 'react-router-dom';
import BasicErrorPage from '../components/tools/basicErrorPage';
import Home from '../components/home';
import Login from '../components/loginForm';
import LogOut from '../components/logOut';
import { ProtectedRoute } from "./protectedRoute";
import { RedirectHome } from "./redirectToHome";
import InfoGenerale from '../components/visite/information';
import Element from '../components/visite/element';
import Recapitulatif from '../components/visite/recapitulatif';
import ListeSignature from '../components/visite/signature';
import Cloture from '../components/visite/cloture';
import Declarant from '../components/visite/declarant';
import Policy from '../components/policy';

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
      path: "/info/:visiteIdParam?",
      element: <ProtectedRoute><InfoGenerale /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/element/:secteurParam?/:composantParam?",
      element: <ProtectedRoute><Element /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/recap",
      element: <ProtectedRoute><Recapitulatif /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/signatures",
      element: <ProtectedRoute><ListeSignature /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/cloture",
      element: <ProtectedRoute><Cloture /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/declarant",
      element: <ProtectedRoute><Declarant /></ProtectedRoute>,
      errorElement: <BasicErrorPage />,
    },
    {
      path: "/policy",
      element: <Policy />,
      errorElement: <BasicErrorPage />,
    }
]);

export default router;