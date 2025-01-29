import React from "react";
import {useParams} from "react-router";


// Components
import Loading from "./components/Loading.tsx";

// Hooks
import {useGetEnrollmentByPrimeQuery} from "./store/api/core.tsx";

// Components
import Media from "./components/Enrollment/Media";
import Preview from "./components/Enrollment/Preview";
import Extraction from "./components/Enrollment/Extraction";
import Finalize from "./components/Enrollment/Finalize";

export default function Enrollment() {
    const {enrollmentId} = useParams();
    const [step, setStep] = React.useState(1);

    const stepLabels = ["Prepare Media", "Review", "Extraction", "Finalize"];

    const {data, isLoading} = useGetEnrollmentByPrimeQuery({enrollmentId: enrollmentId as string});

    if (isLoading || !data) return <Loading/>;

    const nextStep = ()=>setStep(prevState => prevState + 1);
    return (
        <main className='flex-grow pt-16 bg-gray-50 p-6'>
            <h1 className="text-2xl font-semibold text-blue-700 mb-6">Add Faces</h1>
            <div className="border-b border-gray-300 my-4"></div>

            {/* Stepper */}
            <div className="flex justify-between items-center mb-6">
                {stepLabels.map((label, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                step === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-gray-700"
                            }`}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={`ml-2 text-xs font-semibold${
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

            <div>
                {step === 1 && (<Media enrollment={data.data} nextStep={nextStep}/>)}
                {step === 2 && (<Preview enrollmentId={data.data.prime} nextStep={nextStep}/>)}
                {step === 3 && (<Extraction enrollmentId={data.data.prime} nextStep={nextStep}/>)}
                {step === 4 && (<Finalize/>)}
            </div>

        </main>
    );
}