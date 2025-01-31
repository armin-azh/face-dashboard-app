import {useEffect, useState} from "react";
import {Centrifuge} from "centrifuge";

// Icons
import { FaCheck } from "react-icons/fa6";

// Hooks
import {useGetEnrollmentByPrimeQuery} from "../../../store/api/core.tsx";

// components
import Loading from "../../Loading.tsx";
import ChannelStatus from "../../ChannelStatus.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=>void;
}

export default function Finalize(props: Props) {
    const [channelConnection, setChannelConnection] = useState<string>('disconnected');
    const {data, isLoading, refetch} = useGetEnrollmentByPrimeQuery({enrollmentId: props.enrollmentId});

    useEffect(() => {
        const centrifugo = new Centrifuge(`${import.meta.env.VITE_CENTRIFUGO_URL}/connection/websocket`,
            {
                getToken: async ()=>{
                    const result = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/enrollments/enrollment/${props.enrollmentId}/jwt`);
                    const data = await result.json();
                    return data.token;
                }
            });

        centrifugo.on('connecting',()=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(`Connecting to enrollment ${props.enrollmentId} channel`);
            }
            setChannelConnection('connecting');
        });

        centrifugo.on('connected', ()=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(`Connected to enrollment ${props.enrollmentId} channel`);
            }
            setChannelConnection('connected');
        });

        centrifugo.on('disconnected',()=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(`Disconnected to enrollment ${props.enrollmentId} channel`);
            }
            setChannelConnection('disconnected');
        });

        centrifugo.on('publication', (message)=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(message);
            }
            refetch();
        });

        centrifugo.connect();
    }, []);


    if(isLoading || !data) return (
        <Loading />
    )

    if (channelConnection === "disconnected" || channelConnection === "connecting") return <ChannelStatus status={channelConnection}/>

    if(data.data.status !== "commit"){
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="text-xl font-bold mb-4 text-green-600">Please wait...</div>
                <div className="p-6 border border-gray-300 rounded-lg bg-white text-center shadow-lg">
                    <p className="mb-3 text-lg font-medium text-gray-700">Your session is currently on {data.data.status}.</p>
                    <p className="text-gray-600">This may take a few moments. Thank you for your patience.</p>
                </div>
                <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="p-6 border border-gray-300 rounded-lg bg-white text-center shadow-lg">
                <p className="mb-3 text-lg font-medium text-gray-700">New has been added successfully.</p>
            </div>
            <FaCheck className='text-green-500'/>
            <button className='mt-4 duration-300 text-green-600 hover:text-green-700' onClick={() => {
                props.nextStep();
            }}>
                Continue
            </button>
        </div>
    )


}