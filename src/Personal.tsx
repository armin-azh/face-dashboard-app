import {useParams, useSearchParams} from "react-router";
import {useState} from "react";

// Hooks
import {usePersonByPrimeQuery, useGetPersonFaceListQuery} from "./store/api/core"; // Update API hooks accordingly

// Components
import NewSourceModal from "./components/NewSourceModal";
import Loading from "./components/Loading.tsx";
import {FaCircleCheck} from "react-icons/fa6";
import {GoXCircleFill} from "react-icons/go";

export default function Personal() {
    const [searchParams] = useSearchParams();
    const {prime} = useParams(); // Fetch the ID from the route (e.g., /personal/:id)
    const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") ?? "1", 10));
    const page_size = parseInt(searchParams.get("page_size") ?? "5", 10);

    // Fetch personal details and associated faces
    const {data: person, isLoading: isPersonLoading} = usePersonByPrimeQuery({prime: prime as string}); // Replace with the appropriate hook
    const {data: faces, isLoading: isFacesLoading} = useGetPersonFaceListQuery({personId: prime as string, page: page, page_size:page_size}); // Replace with the appropriate hook

    if (isPersonLoading || isFacesLoading || !person) {return (<Loading/>)}

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Personal Details</h1>
            </header>

            {/* Personal Details Section */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase">ID</p>
                        <p className="text-sm font-medium text-gray-800 mt-2">{person?.data.prime}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                        <p className="text-sm font-medium text-gray-800 mt-2 capitalize">
                            {person?.data.first_name} {person?.data.last_name}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Created At</p>
                        <p className="text-sm font-medium text-gray-800 mt-2">
                            {new Date(person.data.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </section>

            {/* Faces Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-700">Faces</h2>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs shadow-md"
                        onClick={() => setIsFaceModalOpen(true)}
                    >
                        + Add New Face
                    </button>
                </div>

                {/* Faces Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-100">
                        <tr>
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-xs">
                                Face ID
                            </th>
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-xs">
                                Image
                            </th>
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-xs">
                                Index
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {faces && faces.results.map((face, index) => (
                            <tr
                                key={face.id}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-50 transition-all`}
                            >
                                <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
                                    {face.id}
                                </td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}/media/${face.image}`}
                                        alt={`Face ${face.id}`}
                                        className="w-16 h-16 rounded-full object-cover mx-auto"
                                    />
                                </td>
                                <td className="flex flex-col border-gray-200 text-blue-700 font-medium text-center text-sm items-center justify-center h-full">
                                    {face.indexed ? <FaCircleCheck className='text-green-500'/> :
                                        <GoXCircleFill className='text-red-500'/>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {faces && faces.total_pages !==0 && (
                    <div className="mt-6 flex justify-between items-center">
                        <button
                            className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm text-sm"
                            disabled={faces.page === 1}
                            onClick={()=>{
                                if (faces.page > 1){
                                    setPage(prevState => prevState - 1);
                                }
                            }
                            }
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 font-semibold text-sm">
                    Page {faces.page} of {faces.total_pages}
                </span>
                        <button
                            className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm text-sm"
                            disabled={faces.page === faces.total_pages}
                            onClick={()=>{
                                if(faces.page < faces.total_pages){
                                    setPage(prevState => prevState + 1);
                                }}
                            }
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            {/* Add New Face Modal */}
            {isFaceModalOpen && <NewSourceModal setIsModalOpen={setIsFaceModalOpen} />}
        </main>
    );
}