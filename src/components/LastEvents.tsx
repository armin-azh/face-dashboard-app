import {BsCalendar2EventFill} from "react-icons/bs";
import {Link} from "react-router";

// Hooks
import {useGetEventListQuery} from "../store/api/core.tsx";

interface Props {
    className?: string
}

export default function LastEvents(props:Props) {

    const {data} = useGetEventListQuery({page:1, page_size:10})

    return (
        <div className={`bg-white p-4 rounded-lg shadow col-span-1 h-96 overflow-y-auto list-scroll ${props.className}`}>
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
                {data && data.results.map((item, index) => {
                    const isUnknown = item.person_id === null;
                    const isNewEvent = index < 3; // Assuming the first 3 events are new
                    const itemBgClass = isUnknown ? "bg-red-50" : isNewEvent ? "bg-green-50" : "bg-slate-50";

                    return (
                        <li
                            key={index}
                            className={`flex items-center p-4 hover:bg-indigo-50 transition-all rounded-md ${itemBgClass}`}
                        >
                            <div
                                className="flex items-center justify-center w-12 h-12">
                                <img src={`${import.meta.env.VITE_API_BASE_URL}/media${item.face_thumbnail}`} alt={'Person image'} className='rounded-md'/>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-800">Camera {item.camera_name}</p>
                                <p className="text-xs text-gray-600">
                                    Person {item.person_first_name && item.person_last_name ? `${item.person_first_name} ${item.person_last_name}`:'Unknown'} • {new Date(item.happend_at).toLocaleTimeString()}
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
    )
}