import {useState, useEffect} from "react";
import {Link, Outlet, useLocation} from "react-router";
import classNames from "classnames";
import {Version} from "../../resources/strings.tsx";

// Icons
import {MdDashboard, MdPeopleAlt} from "react-icons/md";
import {IoIosSettings} from "react-icons/io";
import { CgMediaLive } from "react-icons/cg";
import {BsCalendar2EventFill} from "react-icons/bs";
import { GiCctvCamera } from "react-icons/gi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdOutlineMonitor } from "react-icons/md";

// Components
import Notification from "../Notification.tsx";
import DateTimeDisplay from "../Time.tsx";

export default function DashboardLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        const cachedState = localStorage.getItem("isSidebarOpen");
        return cachedState !== null ? JSON.parse(cachedState) : true;
    });

    useEffect(() => {
        localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <div
            className={classNames('fixed flex flex-col inset-y-0 left-0 bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-50 divide-y divide-gray-800', {
                'translate-x-0': isSidebarOpen,
                '-translate-x-full': !isSidebarOpen
            })}

        >

            <div className={'flex gap-1 mt-4 px-2'}>
                <div className=''>
                    <img src={'/knowMe.png'} alt={'logo'} className='w-14 h-14'/>
                </div>
                <div className="text-lg font-bold tracking-widest text-center flex items-center">KnowMe</div>
            </div>
            <nav className="my-4">
                <ul className='text-sm'>
                    <Link
                        to={'/'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2", {
                            "bg-gray-700": location.pathname === "/"
                        })}
                    >
                        <MdDashboard/>Dashboard
                    </Link>
                    <Link
                        to={'/live'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2", {
                            "bg-gray-700": location.pathname === "/live"
                        })}
                    >
                        <CgMediaLive/>Live
                    </Link>
                    <Link
                        to={'/cameras'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2", {
                            "bg-gray-700": location.pathname === "/cameras"
                        })}
                    >
                        <GiCctvCamera/>camera
                    </Link>
                    <Link
                        to={'/personals'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2", {
                            "bg-gray-700": location.pathname === "/personals"
                        })}
                    >
                        <MdPeopleAlt/>Personals
                    </Link>
                    <Link
                        to={'/events'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2", {
                            "bg-gray-700": location.pathname === "/events"
                        })}
                    >
                        <BsCalendar2EventFill/>Events
                    </Link>
                    <Link
                        to={'/settings'}
                        className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer", {
                            "bg-gray-700": location.pathname === "/settings"
                        })}
                    >
                        <IoIosSettings/>Settings
                    </Link>
                </ul>
            </nav>

            <Link
                to={'#'}
                onClick={(e) => {
                    e.preventDefault();
                    window.open(import.meta.env.VITE_API_STREAM_URL, '_blank', 'noopener,noreferrer');
                }}
                className={classNames("flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer mb-2 text-sm")}
            >
                <MdOutlineMonitor/> Monitor
            </Link>

            {/* Footer (Version) */}
            <div className="mt-auto p-4 text-center text-xs">
                <span>Version {Version}</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
            {/* Navbar */}
            <header className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center fixed w-full z-40">
                <button
                    className="text-white focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <HiOutlineMenuAlt3 className={'h-6 w-6'}/>
                </button>
                <div className='flex gap-4'>
                    <DateTimeDisplay/>
                    <Notification/>
                </div>
            </header>

            {/* Page Content */}
            <Outlet/>
        </div>

        {/* Sidebar Overlay (for mobile) */}
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={toggleSidebar}
            ></div>
        )}
    </div>

}