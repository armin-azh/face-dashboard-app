
interface NewCameraModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onUpdate: ()=> void;
}

export default function NewCameraModal({setIsModalOpen}: NewCameraModalProps) {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-[20vw] h-[40vh] flex flex-col justify-between'>
                <div>

                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                        onClick={() => {
                            // create({
                            //     onUpdate: () => {
                            //         setIsModalOpen(false);
                            //     }
                            // });
                        }}
                        // disabled={isLoading}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        onClick={() => setIsModalOpen(false)}
                        // disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}