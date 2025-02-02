import {useState, useEffect} from "react";
import {nanoid} from "@reduxjs/toolkit";
import {useSearchParams} from "react-router";

// Hooks
import {useGetCameraListQuery} from "./store/api/core.tsx";
import {Link} from "react-router";

// Icons
import { FaCircleCheck } from "react-icons/fa6";
import { GoXCircleFill } from "react-icons/go";
import { MdOutlineAddCircle } from "react-icons/md";

// Component
import NewCameraModal from "./components/NewCameraModal";
import Loading from "./components/Loading";
import BreakCrumb from "./components/BreakCrumb";
import Paginator from "./components/Paginator.tsx";

export default function Cameras() {
    // Retrieve page and page_size from query params with defaults
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") ?? "1", 10));
    const page_size = parseInt(searchParams.get("page_size") ?? "10", 10);

    const {data, refetch, isLoading} = useGetCameraListQuery({page,page_size, type:'*'});


    useEffect(() => {
        document.title = "KnowMe | Cameras";
    }, []);

    if (isLoading) {
        return <Loading/>
    }

    return (
        <main className='flex-grow pt-16 bg-gray-50 p-6'>
            <BreakCrumb header={{to: '/', name: 'Dashboard'}} primary={'Cameras'}/>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Cameras Page</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm shadow-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    <i className="text-xl">
                        <MdOutlineAddCircle/>
                    </i>
                    <span>Add Camera</span>
                </button>
            </div>

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
                    <tbody>
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
                                    {item.url}
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

            {/* Modal */}
            {isModalOpen && (<NewCameraModal setIsModalOpen={setIsModalOpen} onUpdate={()=> refetch()}/>)}
        </main>
    )
}