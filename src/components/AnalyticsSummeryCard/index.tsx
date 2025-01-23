
import {BiStats} from "react-icons/bi";

// Components
import EventStatus from "./EventStatus.tsx";
import EventHistory from "./EventHistory.tsx";
import ActiveCameras from "./ActiveCameras.tsx";


export default function AnalyticsSummeryCard() {


    return (
        <div className="bg-white p-4 rounded shadow md:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BiStats className="text-blue-500 text-2xl" />
                Analytics and Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recognition Stat Overview */}
                <EventStatus/>

                {/* Camera Usage Stats Placeholder */}
                <ActiveCameras/>

                {/* Activity Summary Chart */}
                <EventHistory/>
            </div>
        </div>
    );
}