
// Hooks
import useCreateCamera from "../../hooks/use-create-camera.tsx";

interface NewCameraModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onUpdate: ()=> void;
}

export default function NewCameraModal({setIsModalOpen,onUpdate}: NewCameraModalProps) {
    const {form, create, isLoading, setForm} = useCreateCamera();

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[40vw] h-[50vh] flex flex-col justify-between'>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Add New Person</h2>
                    <div className="border-b border-gray-300 my-4"></div>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter name"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="type"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Type
                        </label>
                        <select
                            id="type"
                            value={form.type}
                            onChange={(e) => setForm({...form, type: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recording">Recording</option>
                            <option value="entry">Entry</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="url"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            URL
                        </label>
                        <input
                            type="text"
                            id="url"
                            value={form.url}
                            onChange={(e) => setForm({...form, url: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter URL"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="on_demand"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            On-Demand
                        </label>
                        <input
                            type="checkbox"
                            id="on_demand"
                            checked={form.on_demand}
                            onChange={(e) => setForm({...form, on_demand: e.target.checked})}
                            className="h-5 w-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                        onClick={() => {
                            create({
                                onUpdate: () => {
                                    setIsModalOpen(false);
                                    onUpdate();
                                }
                            });
                        }}
                        disabled={isLoading}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}