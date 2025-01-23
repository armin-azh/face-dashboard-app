import {Link} from "react-router";

// Icons
import {BsCalendar2EventFill} from "react-icons/bs";

// Hooks
import {useGetEventStatsQuery} from "../../store/api/core.tsx";

export default function Event() {
    const {data, isLoading} = useGetEventStatsQuery();

    if (isLoading || !data) return (
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <BsCalendar2EventFill className="text-4xl text-purple-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Event Logs</h2>
                <div role="status" className="w-full animate-pulse">
                    <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <Link to="/events"
                  className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                View
            </Link>
        </div>
    );
    return (
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <BsCalendar2EventFill className="text-4xl text-purple-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Event Logs</h2>
                <p className="text-3xl font-extrabold text-gray-900">{data.data.total_events}</p>
            </div>
            <Link to="/events"
                  className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                View
            </Link>
        </div>
    )
}