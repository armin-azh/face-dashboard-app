import {useParams} from "react-router";
import {useState} from "react";
import {usePersonByPrimeQuery} from "./store/api/core"; // Update API hooks accordingly
import NewSourceModal from "./components/NewSourceModal";

export default function Personal() {
    const {prime} = useParams(); // Fetch the ID from the route (e.g., /personal/:id)
    const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

    // Fetch personal details and associated faces
    const {data: person, isLoading: isPersonLoading} = usePersonByPrimeQuery({prime: prime as string}); // Replace with the appropriate hook
    // const {data: faces, isLoading: isFacesLoading} = useListFacesQuery(id); // Replace with the appropriate hook

    console.log(person)
    if (isPersonLoading || !person) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Personal Details</h1>
            </header>

            {/* Personal Details Section */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-gray-500 uppercase">ID</p>
                        <p className="text-lg font-medium text-gray-800 mt-2">{person?.data.prime}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Name</p>
                        <p className="text-lg font-medium text-gray-800 mt-2 capitalize">
                            {person?.data.first_name} {person?.data.last_name}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Created At</p>
                        <p className="text-lg font-medium text-gray-800 mt-2">
                            {new Date(person.data.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </section>

            {/* Faces Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Faces</h2>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm shadow-md"
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
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-sm">
                                Face ID
                            </th>
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-sm">
                                Image
                            </th>
                            <th className="px-6 py-3 border-b-2 font-semibold text-center text-blue-700 uppercase text-sm">
                                Uploaded At
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{faces.results.map((face, index) => (*/}
                        {/*    <tr*/}
                        {/*        key={face.id}*/}
                        {/*        className={`${*/}
                        {/*            index % 2 === 0 ? "bg-gray-100" : "bg-white"*/}
                        {/*        } hover:bg-blue-50 transition-all`}*/}
                        {/*    >*/}
                        {/*        <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">*/}
                        {/*            {face.id}*/}
                        {/*        </td>*/}
                        {/*        <td className="px-6 py-4 border-b border-gray-200 text-center">*/}
                        {/*            <img*/}
                        {/*                src={face.image_url}*/}
                        {/*                alt={`Face ${face.id}`}*/}
                        {/*                className="w-16 h-16 rounded-full object-cover mx-auto"*/}
                        {/*            />*/}
                        {/*        </td>*/}
                        {/*        <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">*/}
                        {/*            {new Date(face.created_at).toLocaleString()}*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*))}*/}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add New Face Modal */}
            {isFaceModalOpen && <NewSourceModal setIsModalOpen={setIsFaceModalOpen} />}
        </main>
    );
}