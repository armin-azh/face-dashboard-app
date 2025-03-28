import {useEffect, useState} from "react";
import {FaUserPlus} from "react-icons/fa";
import {Link, useSearchParams} from "react-router";

// Component
import NewPersonModal from "./components/NewPersonModal";
import Loading from "./components/Loading.tsx";
import BreakCrumb from "./components/BreakCrumb.tsx";

// Hooks
import {useListPersonsQuery} from "./store/api/core.tsx";
import Paginator from "./components/Paginator.tsx";

export default function Personals() {
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") ?? "1", 10));
    const page_size = parseInt(searchParams.get("page_size") ?? "10", 10);

    const {data, isLoading, refetch} = useListPersonsQuery({page, page_size});

    useEffect(() => {
        document.title = "KnowMe | Personals";
    }, []);

    if (isLoading || !data) {
        return <Loading/>
    }

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <BreakCrumb header={{to:'/', name: 'Dashboard'}} primary={"Personals"}/>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Personals Page</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm shadow-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    <i className="text-xl">
                        <FaUserPlus/>
                    </i>
                    <span>Add Person</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-100">
                    <tr>
                        <th className="px-6 py-2 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Thumbnail
                        </th>
                        <th className="px-6 py-2 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            ID
                        </th>
                        <th className="px-6 py-2 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Name
                        </th>
                        <th className="px-6 py-2 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Created At
                        </th>
                        <th className="px-6 py-2 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data && (
                        data.results.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-50 transition-all`}
                            >
                                {/* Thumbnail Column */}
                                <td className="px-6 py-2 border-b border-gray-200 text-center">
                                    <img
                                        src="/default-person.jpg"
                                        alt="Thumbnail"
                                        className="w-12 h-12 rounded-full object-cover mx-auto shadow-sm"
                                    />
                                </td>
                                <td className="px-6 py-2 border-b border-gray-200 text-blue-700 font-medium text-center text-sm">
                                    {item.prime}
                                </td>
                                <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-medium text-center capitalize text-sm">
                                    {item.first_name} {item.last_name}
                                </td>
                                <td className="px-6 py-2 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    {new Date(item.created_at).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')}
                                </td>
                                <td className="px-6 py-2 border-b border-gray-200 text-center text-sm">
                                    <Link
                                        to={`/personals/personal/${item.prime}`}
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
            {isModalOpen && (
                <NewPersonModal setIsModalOpen={setIsModalOpen} refetch={refetch}/>
            )}
        </main>
    );
}