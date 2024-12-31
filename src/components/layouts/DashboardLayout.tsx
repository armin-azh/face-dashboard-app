import {useState} from "react";
import { Outlet } from "react-router";
import classNames from "classnames";
import {Version} from "../../resources/strings.tsx";

// Components
import Notification from "../Notification.tsx";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <div className="p-4 text-lg font-bold">My Sidebar</div>
            <nav className="mt-4">
                <ul>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">About</li>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Services</li>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Contact</li>
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