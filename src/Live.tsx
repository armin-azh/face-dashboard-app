import {useEffect} from "react";

// Components
import LastEvents from "./components/LastEvents";
import LiveVideo from "./components/LiveVideo.tsx";


export default function Live() {

    useEffect(() => {
        document.title = "KnowMe | Live";
    }, []);

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6 h-screen overflow-hidden">
            <div className="grid grid-cols-5 gap-2 h-full">
                {/* Camera Streams Section */}
                <LiveVideo/>

                {/* Last Events Section */}
                <LastEvents className='h-full p-0' />
            </div>
        </main>
    );
}