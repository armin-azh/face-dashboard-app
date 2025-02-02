import {useEffect} from "react";

// Components
import BreakCrumb from "./components/BreakCrumb.tsx";

export default function Settings() {

    useEffect(() => {
        document.title = "KnowMe | Settings";
    }, []);

    return <main className="flex-grow pt-16 bg-gray-100 p-4">
        <BreakCrumb header={{to: '/', name: 'Dashboard'}} primary={'Settings'}/>
        <h1 className="text-2xl font-bold">Settings Page</h1>
        <p className="mt-2">
            This is a sample application with a navbar and a toggleable sidebar.
        </p>
    </main>
}