import React from "react";
import {useParams} from "react-router";

// Components
import SourceType from "./SourceType";

// Hooks
import useCreateEnrollment from "../../hooks/use-create-enrollment.tsx";


interface NewPersonModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

export default function NewSourceModal({setIsModalOpen}: NewPersonModalProps) {
    const {prime} = useParams(); // Fetch the ID from the route (e.g., /personal/:id)
    const [step, setStep] = React.useState(1);


    const {setForm: setEnrollmentForm, create} = useCreateEnrollment();

    const handleNext = () => {
        if(step === 1){
            create(prime as string, {});
        }
        setStep((prev) => prev + 1);
    };
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));


    const stepLabels = ["Select Data Source", "Number of Faces", "Review"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[80vw] h-[80vh]">
                <h2 className="text-lg font-bold text-gray-800">Add New Person</h2>
                <div className="border-b border-gray-300 my-4"></div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-6">
                    {stepLabels.map((label, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                    step === index + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-gray-700"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <span
                                className={`ml-2 ${
                                    step === index + 1 ? "text-blue-500" : "text-gray-700"
                                }`}
                            >
                                {label}
                            </span>
                            {index < stepLabels.length - 1 && (
                                <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>
                            )}
                        </div>
                    ))}
                </div>

                <form>
                    {step === 1 && (
                        <SourceType setSource={(source: string)=>{
                            setEnrollmentForm({type: source})
                        }}/>
                    )}
                    {step === 2 && (
                        <div className="mb-4">
                            <label
                                htmlFor="faces"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Number of Faces
                            </label>
                            <input
                                type="number"
                                id="faces"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of faces"
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="mb-4">
                            <p className="text-gray-700">Review your inputs or perform the final step.</p>
                        </div>
                    )}
                    <div className="flex justify-end">
                        {step > 1 && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium mr-2"
                                onClick={handleBack}
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Save
                            </button>
                        )}
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}