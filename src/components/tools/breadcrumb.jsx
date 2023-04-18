import { useLocation } from 'react-router-dom'

export default function Breadcrumb(){

    const currentLocation = useLocation();

    return(
        <div className="flex flex-row m-9 text-xs">
            <div className="inline-flex mr-3">
                <div className={`flex border text-[color:var(--input-border-color)] border-[color:var(--input-border-color)] rounded-full shrink-0 grow-0 items-center justify-center w-7 h-7 ${currentLocation.pathname.includes('/info') ? "bg-[color:var(--first-button-color)] !text-[color:var(--second-text-color)] border-none outline-offset-4 outline-[color:var(--first-button-color)] outline-1 outline-dashed border:animate-spin":"" }`}>
                    <p>1</p>
                </div>
                {currentLocation.pathname.includes('/info') ?
                    <div className="flex items-center ml-3 text-sm text-[color:var(--first-button-color)]">
                        <h5>Informations</h5>
                    </div>:
                    <div className="flex items-center ml-3 text-sm text-gray-400">
                        <h5>-</h5>
                    </div>
                }
            </div>
            <div className="inline-flex mr-3">
                <div className={`flex border text-[color:var(--input-border-color)] border-[color:var(--input-border-color)] rounded-full shrink-0 grow-0 items-center justify-center w-7 h-7 ${currentLocation.pathname.includes('/element') ? "bg-[color:var(--first-button-color)] !text-[color:var(--second-text-color)] border-none outline-offset-4 outline-[color:var(--first-button-color)] outline-1 outline-dashed border:animate-spin":"" }`}>
                    <p>2</p>
                </div>
                {currentLocation.pathname.includes('/element') ?
                    <div className="flex items-center ml-3 text-sm text-[color:var(--first-button-color)]">
                        <h5>Installations</h5>
                    </div>:
                    <div className="flex items-center ml-3 text-sm text-gray-400">
                        <h5>-</h5>
                    </div>
                }
            </div>
            <div className="inline-flex mr-3">
                <div className={`flex border text-[color:var(--input-border-color)] border-[color:var(--input-border-color)] rounded-full shrink-0 grow-0 items-center justify-center w-7 h-7 ${currentLocation.pathname.includes('/recap') ? "bg-[color:var(--first-button-color)] !text-[color:var(--second-text-color)] border-none outline-offset-4 outline-[color:var(--first-button-color)] outline-1 outline-dashed border:animate-spin":"" }`}>
                    <p>3</p>
                </div>
                {currentLocation.pathname.includes('/recap') ?
                    <div className="flex items-center ml-3 text-sm text-[color:var(--first-button-color)]">
                        <h5>Récapitulatif</h5>
                    </div>:
                    <div className="flex items-center ml-3 text-sm text-gray-400">
                        <h5>-</h5>
                    </div>
                }
            </div>
            <div className="inline-flex mr-3">
                <div className={`flex border text-[color:var(--input-border-color)] border-[color:var(--input-border-color)] rounded-full shrink-0 grow-0 items-center justify-center w-7 h-7 ${currentLocation.pathname.includes('/signatures') ? "bg-[color:var(--first-button-color)] !text-[color:var(--second-text-color)] border-none outline-offset-4 outline-[color:var(--first-button-color)] outline-1 outline-dashed border:animate-spin":"" }`}>
                    <p>4</p>
                </div>
                {currentLocation.pathname.includes('/signatures') ?
                    <div className="flex items-center ml-3 text-sm text-[color:var(--first-button-color)]">
                        <h5>Signatures</h5>
                    </div>:
                    <div className="flex items-center ml-3 text-sm text-gray-400">
                        <h5>-</h5>
                    </div>
                }
            </div>
            <div className="inline-flex mr-3">
                <div className={`flex border text-[color:var(--input-border-color)] border-[color:var(--input-border-color)] rounded-full shrink-0 grow-0 items-center justify-center w-7 h-7 ${currentLocation.pathname.includes('/cloture') ? "bg-[color:var(--first-button-color)] !text-[color:var(--second-text-color)] border-none outline-offset-4 outline-[color:var(--first-button-color)] outline-1 outline-dashed border:animate-spin":"" }`}>
                    <p>5</p>
                </div>
                {currentLocation.pathname.includes('/cloture') &&
                    <div className="flex items-center ml-3 text-sm text-[color:var(--first-button-color)]">
                        <h5>Clôture</h5>
                    </div>
                }
            </div>
        </div>
    )
}