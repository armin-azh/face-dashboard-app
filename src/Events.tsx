import { useState } from "react";

const mockData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    numberOfFaces: Math.floor(Math.random() * 10) + 1,
    createdAt: new Date().toISOString(),
}));

export default function Events() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(mockData.length / itemsPerPage);

    const currentData = mockData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <main className="flex-grow pt-16 bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Events</h1>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-300 font-semibold text-center text-gray-700">
                            Thumbnail
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 font-semibold text-center text-gray-700">
                            ID
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 font-semibold text-center text-gray-700">
                            Name
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 font-semibold text-center text-gray-700">
                            Number of Faces
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 font-semibold text-center text-gray-700">
                            Created At
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`${
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } hover:bg-gray-50`}
                        >
                            {/* Thumbnail Column */}
                            <td className="px-4 py-3 border-b border-gray-200 text-center">
                                <img
                                    src="/default-person.jpg"
                                    alt="Thumbnail"
                                    className="w-12 h-12 rounded-full object-cover mx-auto"
                                />
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.id}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.name}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {item.numberOfFaces}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 text-gray-700 text-center">
                                {new Date(item.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                    disabled={currentPage === 1}
                    onClick={goToPreviousPage}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                    disabled={currentPage === totalPages}
                    onClick={goToNextPage}
                >
                    Next
                </button>
            </div>
        </main>
    );
}