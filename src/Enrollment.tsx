import React from "react";
import {useParams} from "react-router";

// Components
import Loading from "./components/Loading.tsx";

// Hooks
import {useGetEnrollmentByPrimeQuery} from "./store/api/core.tsx";

export default function Enrollment() {
    const {prime, enrollmentId} = useParams();
    const [step, setStep] = React.useState(1);

    const stepLabels = ["Prepare Media", "Review", "Extraction", "Finalize"];

    const {data, isLoading} = useGetEnrollmentByPrimeQuery({enrollmentId: enrollmentId as string});

    if (isLoading || !data) return <Loading/>;

    return (
        <main className='flex-grow pt-16 bg-gray-50 p-6'>
            <h1 className="text-2xl font-semibold text-blue-700 mb-6">Add Faces</h1>
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
                            className={`ml-2 text-xs ${
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
                    <></>
                    // <SourceType personId={prime as string} nextStep={()=>setStep((prev) => prev + 1)} cancel={()=>setIsModalOpen(false)}/>
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
            </form>

        </main>
    );
}