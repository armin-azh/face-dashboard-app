
// Hooks
import {useGetEnrollmentByPrimeQuery} from "../../../store/api/core.tsx";

// Components
import Video from "./Video.tsx";
import Images from "./Images.tsx";
import Loading from "../../Loading.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}


export default function Preview(props: Props){
    const {data,isLoading, refetch} = useGetEnrollmentByPrimeQuery({enrollmentId: props.enrollmentId});
    
    if(isLoading || !data){
        return <Loading/>
    }
    
    if(data.data.status !== "staged"){

        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6 rounded shadow-lg">
                <div className="text-center text-gray-600 mb-4 font-medium">
                    This enrollment does not have any media.
                </div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                >
                    Refresh
                </button>
            </div>
        );
    }

    if(data.data.type === "video" || data.data.type === "recording"){
        return <Video enrollmentId={props.enrollmentId} nextStep={props.nextStep}/>
    }else if(data.data.type === "images"){
        return <Images enrollmentId={props.enrollmentId}/>
    }else{
        return null;
    }
}