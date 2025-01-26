import {nanoid} from "@reduxjs/toolkit";

// Hooks
import {useGetCameraListQuery} from "./store/api/core.tsx";
import {Link} from "react-router";

// Icons
import { FaCircleCheck } from "react-icons/fa6";
import { GoXCircleFill } from "react-icons/go";


export default function Cameras() {

    const {data} = useGetCameraListQuery();

    console.log(data);

    return (
        <main className='flex-grow pt-16 bg-gray-50 p-6'>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Cameras</h1>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full table-auto border-collapse bg-white shadow-lg rounded-lg'>
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                ID
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                name
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                type
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                url
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                on-demand
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                Created At
                            </th>
                            <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    {data && (
                        data.results.map((item, index)=>(
                            <tr key={nanoid()}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-50 transition-all`}
                            >
                                <td className="px-6 py-4 border-b border-gray-200 text-blue-700 font-medium text-center text-sm">
                                    {item.prime}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    {item.type}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    http://localhost:12
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-blue-700 font-medium text-center text-sm flex justify-center items-center">
                                    {item.on_demand ? <FaCircleCheck className='text-green-500'/> :
                                        <GoXCircleFill className='text-red-500'/>}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    {new Date(item.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
                                    <Link
                                        to={`/cameras/camera/${item.prime}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </table>
            </div>
        </main>
    )
}