import {useParams} from "react-router";

// Icons
import {AiOutlineVideoCamera} from "react-icons/ai";
import {BsCameraVideo} from "react-icons/bs";
import {FaImages} from "react-icons/fa";

// Hooks
import useCreateEnrollment from "../../hooks/use-create-enrollment.tsx";

interface NewPersonModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function NewSourceModal({setIsModalOpen}: NewPersonModalProps) {
    const {prime} = useParams(); // Fetch the ID from the route (e.g., /personal/:id)

    const {setForm, create} = useCreateEnrollment();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[80vw] h-[80vh]">
                <h2 className="text-lg font-bold text-gray-800">Add New Face</h2>
                <div className="border-b border-gray-300 my-4"></div>

                <div className="mb-4">
                    <p className="block text-gray-700 font-medium mb-2">
                        Choose the data source for the person:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label
                            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                            onClick={() => setForm(prevState => ({...prevState, type: "recording"}))}>
                            <input
                                type="radio"
                                name="dataSource"
                                value="recording"
                                className="hidden"
                            />
                            <div
                                className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mb-2">
                                <i className="react-icons/ai"><AiOutlineVideoCamera/></i>
                            </div>
                            <span className="text-gray-700 font-medium">Recording</span>
                        </label>
                        <label
                            onClick={() => setForm(prevState => ({...prevState, type: 'video'}))}
                            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer">
                            <input
                                type="radio"
                                name="dataSource"
                                value="uploadVideo"
                                className="hidden"
                            />
                            <div
                                className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mb-2">
                                <i className="react-icons/bs"><BsCameraVideo/></i>
                            </div>
                            <span className="text-gray-700 font-medium">Upload Video</span>
                        </label>
                        <label
                            onClick={() => setForm(prevState => ({...prevState, type: 'image'}))}
                            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer">
                            <input
                                type="radio"
                                name="dataSource"
                                value="uploadImages"
                                className="hidden"
                            />
                            <div
                                className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mb-2">
                                <i className="react-icons/fa"><FaImages/></i>
                            </div>
                            <span className="text-gray-700 font-medium">Upload Images</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-gray-100 rounded-lg hover:bg-blue-600 transition font-medium mr-2"
                        onClick={()=>{
                            create(prime as string,{})
                        }}>
                        Create
                    </button>
                    <button
                        type="button"
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        onClick={()=>setIsModalOpen(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}