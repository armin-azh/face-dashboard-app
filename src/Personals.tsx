import {useState} from "react";
import {FaUserPlus} from "react-icons/fa";
import {Link} from "react-router";

// Component
import NewPersonModal from "./components/NewPersonModal";
import Loading from "./components/Loading.tsx";

// Hooks
import {useListPersonsQuery} from "./store/api/core.tsx";

export default function Personals() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {data, isLoading} = useListPersonsQuery();


    const goToPreviousPage = () => {

    };

    const goToNextPage = () => {

    };

    if (isLoading) {
        return <Loading/>
    }

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Personals Page</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm shadow-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    <i className="text-xl">
                        <FaUserPlus/>
                    </i>
                    <span>Add New Person</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-blue-100">
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Thumbnail
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            ID
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-blue-300 font-semibold text-center text-blue-700 uppercase text-sm">
                            Number of Faces
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
                        data.results.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-50 transition-all`}
                            >
                                {/* Thumbnail Column */}
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <img
                                        src="/default-person.jpg"
                                        alt="Thumbnail"
                                        className="w-16 h-16 rounded-full object-cover mx-auto shadow-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-blue-700 font-medium text-center text-sm">
                                    {item.prime}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-medium text-center capitalize text-sm">
                                    {item.first_name} {item.last_name}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    0
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-gray-600 text-center text-sm">
                                    {new Date(item.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
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
            <div className="mt-6 flex justify-between items-center">
                <button
                    className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm"
                    // disabled={currentPage === 1}
                    onClick={goToPreviousPage}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-semibold text-lg">
                    Page {0} of {0}
                </span>
                <button
                    className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm"
                    // disabled={currentPage === totalPages}
                    onClick={goToNextPage}
                >
                    Next
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <NewPersonModal setIsModalOpen={setIsModalOpen}/>
            )}
        </main>
    );
}