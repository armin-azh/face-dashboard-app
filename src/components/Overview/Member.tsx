import {Link} from "react-router";

// Icons
import {IoMdPerson} from "react-icons/io";

// Hooks
import {useGetPersonStatsQuery} from "../../store/api/core.tsx";


export default function Member() {

    const {data, isLoading} = useGetPersonStatsQuery();

    if (isLoading || !data) return (
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <IoMdPerson className="text-4xl text-green-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Members</h2>
                <div role="status" className="w-full animate-pulse">
                    <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <Link to="/members"
                  className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
                View
            </Link>
        </div>
    )

    return (
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <IoMdPerson className="text-4xl text-green-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Members</h2>
                <p className="text-3xl font-extrabold text-gray-900">{data.data.total_persons}</p>
            </div>
            <Link to="/members"
                  className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
                View
            </Link>
        </div>
    )
}