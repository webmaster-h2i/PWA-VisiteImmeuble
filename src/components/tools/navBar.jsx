import { ReactComponent as IconLogout } from '../../assets/icons/logout.svg';
import { ReactComponent as SepteoLogo } from '../../assets/images/septlogo.svg';
import { useSelector } from "react-redux";
import { token } from '../../store/tokenSlice.jsx';

export default function Navbar (){

    const authToken = useSelector(token);

    // On vérifie que l'utilisateur soit connecté pour afficher la barre de navigation
    if(authToken){
        return(
            <nav className="px-2 sm:px-4 py-3 justify-between bg-[color:var(--first-main-color)]">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <a href={"/"}>
                        <div className="inline-flex text-white">
                            <SepteoLogo className="h-6"/>
                            <div className="ml-2 text-lg">
                                <h4>NaviLite</h4>
                            </div>
                        </div>
                    </a>
                    <div className="flex flex-row-reverse space-x-4 space-x-reverse text-[color:var(--second-text-color)]">
                        <a href={"/logout"}>
                            <IconLogout className="w-6"/>
                        </a>
                    </div>
                </div>
            </nav>
        );
    }
}