import {useState, useEffect} from "react";
import {Link, Outlet, useLocation} from "react-router";
import classNames from "classnames";
import {Version} from "../../resources/strings.tsx";

// Icons
import {MdDashboard, MdPeopleAlt} from "react-icons/md";
import {IoIosSettings} from "react-icons/io";
import { CgMediaLive } from "react-icons/cg";
import {BsCalendar2EventFill} from "react-icons/bs";

// Components
import Notification from "../Notification.tsx";

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
            className={classNames('fixed flex flex-col inset-y-0 left-0 bg-gray-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-50', {
                'translate-x-0': isSidebarOpen,
                '-translate-x-full': !isSidebarOpen
            })}

        >

            <div className="p-4 text-lg font-bold tracking-widest">KnowMe</div>
            <nav className="mt-4">
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
                    {/* Hamburger Icon */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
                <Notification/>
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