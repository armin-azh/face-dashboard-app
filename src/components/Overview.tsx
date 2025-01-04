import {Link} from "react-router";

import {GiCctvCamera} from "react-icons/gi";
import {IoMdPerson} from "react-icons/io";
import {BsCalendar2EventFill} from "react-icons/bs";

const cameras = 12; // Example data
const personals = 8; // Example data
const events = 200;

export default function Overview() {

    return <>
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <GiCctvCamera className="text-4xl text-blue-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Cameras</h2>
                <p className="text-3xl font-extrabold text-gray-900">{cameras}</p>
            </div>
            <Link to="/cameras"
                  className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                View
            </Link>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <IoMdPerson className="text-4xl text-green-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Members</h2>
                <p className="text-3xl font-extrabold text-gray-900">{personals}</p>
            </div>
            <Link to="/members"
                  className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors">
                View
            </Link>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center relative">
            <BsCalendar2EventFill className="text-4xl text-purple-500 mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Event Logs</h2>
                <p className="text-3xl font-extrabold text-gray-900">{events}</p>
            </div>
            <Link to="/events"
                  className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                View
            </Link>
        </div>
    </>
}