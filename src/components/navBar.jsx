import { ReactComponent as IconHome } from '../assets/icons/home.svg';
import { ReactComponent as IconLogout } from '../assets/icons/logout.svg';
import { ReactComponent as IconUser } from '../assets/icons/user.svg';
import Septlogo from '../assets/images/septlogo.png';

export default function Navbar (){
    return(
        <nav className=" border-gray-200 px-2 sm:px-4 py-2.5 rounded bg-sky-600 justify-between">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
            <div className="rounded-full bg-orange-500">
                <img src={Septlogo} className="h-8 p-1 sm:h-9" alt="Septeo Logo" />
            </div>
                <div className="flex flex-row-reverse space-x-4 space-x-reverse text-white">
                    <a href={"/logout"}>
                        <IconLogout/>
                    </a>
                    <a href={"/accueil"}>
                        <IconHome/>
                    </a>
                    <a href={"/accueil"}>
                        <IconUser/>
                    </a>
                </div>
            </div>
        </nav>
    );
}