import { ReactComponent as IconHome } from '../assets/icons/home.svg';
import { ReactComponent as IconLogout } from '../assets/icons/logout.svg';
import { ReactComponent as IconUser } from '../assets/icons/user.svg';
import Septlogo from '../assets/images/septlogo.png';
import { useSelector } from "react-redux";
import { token } from '../store/tokenSlice.jsx';

export default function Navbar (){

    const authToken = useSelector(token);

    if(authToken){
        return(
            <nav className="border-gray-200 px-2 sm:px-4 py-2.5 bg-sky-600 justify-between">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                <div className="border border-white rounded-full bg-orange-500">
                    <img src={Septlogo} className="h-8 p-1 sm:h-9" alt="Septeo Logo" />
                </div>
                    <div className="flex flex-row-reverse space-x-4 space-x-reverse text-white">
                        <a href={"/logout"}>
                            <IconLogout className='w-6'/>
                        </a>
                        <a href={"/accueil"}>
                            <IconHome className='w-6'/>
                        </a>
                       {/*
                        <a href={"/accueil"}>
                            <IconUser className='w-6'/>
                        </a>
                        */}
                    </div>
                </div>
            </nav>
        );
    }
}