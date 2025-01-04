import {BsCalendar2EventFill} from "react-icons/bs";
import {Link} from "react-router";

const lastEvents = [
    "Camera 1 detected motion",
    "Person 4 logged in",
    "Camera 2 went offline",
    "Camera 3 detected motion",
    "Person 2 logged out",
    "Person 8 logged in",
    "Camera 6 added to the system",
    "Camera 4 detected motion",
    "System backup completed",
    "Person 3 updated profile"
]; // Example data


interface Props {
    className?: string
}

export default function LastEvents(props:Props) {

    return <div className={`bg-white p-4 rounded-lg shadow col-span-1 h-96 overflow-y-auto list-scroll ${props.className}`}>
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-white z-10 p-4 border-b border-gray-300">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BsCalendar2EventFill className="text-indigo-600"/>
                Last Events
            </h2>
            <Link
                to="/events"
                className="text-indigo-600 text-sm font-medium hover:underline hover:text-indigo-700 transition-colors">
                Show All
            </Link>
        </div>
        <ul className="divide-y divide-gray-200">
            {lastEvents.map((_event, index) => {
                const isUnknown = index % 2 === 0;
                const isNewEvent = index < 3; // Assuming the first 3 events are new
                const itemBgClass = isUnknown ? "bg-red-50" : isNewEvent ? "bg-green-50" : "bg-slate-50";

                return (
                    <li
                        key={index}
                        className={`flex items-center p-4 hover:bg-indigo-50 transition-all rounded-md ${itemBgClass}`}
                    >
                        <div
                            className="flex items-center justify-center w-12 h-12">
                            <img src={'/default-person.jpg'} alt={'Person image'} className='rounded-md'/>
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-800">{_event}</p>
                            <p className="text-xs text-gray-600">
                                Camera {index + 1} • {isUnknown ? "Unknown" : `Person ${index}`} • {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <Link
                            to={`/event/${index}`}
                            className="text-indigo-500 text-sm font-medium hover:underline"
                        >
                            Details
                        </Link>
                    </li>
                );
            })}
        </ul>
    </div>
}