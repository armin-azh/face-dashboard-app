
// Components
import LastEvents from "./components/LastEvents";
import LiveVideo from "./components/LiveVideo.tsx";


export default function Live() {

    return (
        <main className="flex-grow pt-16 bg-gray-100 p-4 grid grid-cols-5 gap-2">
            {/* Camera Streams Section */}
            <LiveVideo/>

            {/* Last Events Section */}
            <LastEvents className='h-full p-0' />
        </main>
    );
}