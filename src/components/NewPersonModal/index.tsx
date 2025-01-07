import useCreatePerson from "../../hooks/use-create-person.tsx";

interface NewPersonModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function NewPersonModal({setIsModalOpen}: NewPersonModalProps) {

    const {form, setForm, create, isLoading} = useCreatePerson();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[20vw] h-[40vh] flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Add New Person</h2>
                    <div className="border-b border-gray-300 my-4"></div>

                    <form>
                        <div className="mb-4">
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
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                        onClick={() => {
                            create({
                                onUpdate: () => {
                                    setIsModalOpen(false);
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
    );
}