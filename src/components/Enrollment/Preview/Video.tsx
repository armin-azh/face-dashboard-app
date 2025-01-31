
// Hooks
import {useGetEnrollmentFileListQuery, useProcessEnrollmentMutation} from "../../../store/api/core.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}

export default function Video(props: Props){
    const  {data, isLoading} = useGetEnrollmentFileListQuery({enrollmentId: props.enrollmentId});
    const [process, {isLoading: isProcessing}] = useProcessEnrollmentMutation();
    
    if(isLoading || !data){

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-gray-700 font-medium text-lg">Loading, please wait...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center flex-col">
            <video controls autoPlay loop className="w-2/4 h-auto rounded-lg mb-4">
                <source src={`${import.meta.env.VITE_API_BASE_URL}/media/${data.results[0].path}`} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                    disabled={isProcessing}
                    onClick={()=>{
                        process({enrollmentId: props.enrollmentId})
                            .unwrap()
                            .then(response=>{
                                if (import.meta.env.MODE === 'development') {
                                    console.log(response);
                                }
                                props.nextStep();
                            })
                            .catch(error=>{
                                if (import.meta.env.MODE === 'development') {
                                    console.log(error);
                                }
                            });
                    }}
            >
                Process
            </button>
        </div>
    )
}