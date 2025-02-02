import {useEffect} from "react";

// Components
import BreakCrumb from "./components/BreakCrumb.tsx";

export default function Settings() {

    useEffect(() => {
        document.title = "KnowMe | Settings";
    }, []);

    return <main className="flex-grow pt-16 bg-gray-100 p-4">
        <BreakCrumb header={{to: '/', name: 'Dashboard'}} primary={'Settings'}/>
        <h1 className="text-2xl font-semibold text-blue-700">Settings Page</h1>
        <div className="mt-4 p-6 bg-red-100 text-red-700 text-center rounded-lg shadow-md">
            <p className="text-lg font-semibold">
                This page is not available for this version of the application.
            </p>
        </div>
    </main>
}