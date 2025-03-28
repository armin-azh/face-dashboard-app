import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {nanoid} from "@reduxjs/toolkit";

// Components
import Loading from "./components/Loading.tsx";
import BreakCrumb from "./components/BreakCrumb.tsx";
import Paginator from "./components/Paginator.tsx";

// Hooks
import {useGetEventListQuery} from "./store/api/core.tsx";


export default function Events() {
    const [searchParams] = useSearchParams();

    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") ?? "1", 10));
    const page_size = parseInt(searchParams.get("page_size") ?? "10", 10);

    const {data, isLoading} = useGetEventListQuery({page,page_size});

    useEffect(() => {
        document.title = "KnowMe | Events";
    }, []);

    if (isLoading) {
        return <Loading/>
    }

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <BreakCrumb header={{to: '/', name: 'Dashboard'}} primary={"Events"}/>
            <h1 className="text-2xl font-semibold text-blue-700 mb-6">Events</h1>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Thumbnail
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            ID
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Person
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Camera
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Created At
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    { data && data.results.map((item, index) => (
                        <tr
                            key={nanoid()}
                            className={`${
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } hover:bg-gray-50`}
                        >
                            {/* Thumbnail Column */}
                            <td className="px-4 py-3 border-b border-gray-200 text-center">
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}/media${item.face_thumbnail}`}
                                    alt="Thumbnail"
                                    className="w-12 h-12 rounded-full object-cover mx-auto"
                                />
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.event_id}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.person_first_name && item.person_last_name? item.person_first_name + " " + item.person_last_name : "Unknown"}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.camera_name}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {new Date(item.happend_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {data && data.total_pages !==0 && (
                <Paginator nextPageDisabled={data.page === data.total_pages}
                           prevPageDisabled={data.page === 1}
                           onNextPage={()=>{
                               if(data.page < data.total_pages){
                                   setPage(prevState => prevState + 1);
                               }}}
                           onPrevPage={()=>{
                               if (data.page > 1){
                                   setPage(prevState => prevState - 1);
                               }
                           }}
                           currentPage={data.page}
                           totalPages={data.total_pages}/>
            )}
        </main>
    );
}