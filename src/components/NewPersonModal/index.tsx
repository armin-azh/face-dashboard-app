import useCreatePerson from "../../hooks/use-create-person.tsx";

/**
 * Props interface for the NewPersonModal component
 * @property setIsModalOpen - Function to control the modal's visibility
 * @property refetch - Function to refresh the parent component's data after creating a new person
 */
interface NewPersonModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
    refetch: ()=>void;
}

/**
 * Modal component for creating a new person
 * Displays a form with fields for first and last name
 * Handles form submission and updates parent component on success
 */
export default function NewPersonModal({setIsModalOpen, refetch}: NewPersonModalProps) {
    // Custom hook to manage form state and person creation
    const {form, setForm, create, isLoading} = useCreatePerson();

    return (
        // Modal overlay with semi-transparent black background
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal content container */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-[20vw] h-[40vh] flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Add New Person</h2>
                    <div className="border-b border-gray-300 my-4"></div>

                    {/* Form for entering person details */}
                    <form>
                        <div className="mb-4">
                            {/* First Name input field */}
                            <label
                                htmlFor="firstName"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={form.first_name}
                                onChange={(e) => setForm({...form, first_name: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                placeholder="Enter first name"
                            />
                            {/* Last Name input field */}
                            <label
                                htmlFor="lastName"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={form.last_name}
                                onChange={(e) => setForm(({...form, last_name: e.target.value}))}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter last name"
                            />
                        </div>
                    </form>
                </div>
                {/* Modal action buttons */}
                <div className="flex justify-end">
                    {/* Save button - Creates new person and closes modal */}
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                        onClick={() => {
                            create({
                                onUpdate: () => {
                                    setIsModalOpen(false);
                                    refetch();
                                }
                            });
                        }}
                        disabled={isLoading}
                    >
                        Save
                    </button>
                    {/* Cancel button - Closes modal without saving */}
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
    );
}