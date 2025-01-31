import {useEffect, useState} from "react";
import {Centrifuge} from "centrifuge";

// Component
import Loading from "../../Loading.tsx";
import ChannelStatus from "../../ChannelStatus.tsx";
import Faces from "./Faces.tsx";

// Hooks
import {useGetEnrollmentByPrimeQuery} from "../../../store/api/core.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}

export default function Extraction(props: Props) {
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

    if(isLoading || !data) return (<Loading/>)

    if (channelConnection === "disconnected" || channelConnection === "connecting") return <ChannelStatus status={channelConnection}/>

    if(data.data.status === "staged"){
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="p-6 border border-gray-300 rounded-lg bg-white text-center shadow-lg">
                    <p className="mb-3 text-lg font-medium text-gray-700">Your session is currently staged.</p>
                    <p className="text-gray-600">Which means you have uploaded the Media but it`s not proceed.</p>
                </div>
            </div>
        )
    }else if(data.data.status ==="processing"){
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="text-xl font-bold mb-4 text-blue-600">Please wait...</div>
                <div className="p-6 border border-gray-300 rounded-lg bg-white text-center shadow-lg">
                    <p className="mb-3 text-lg font-medium text-gray-700">Your session is currently being processed.</p>
                    <p className="text-gray-600">This may take a few moments. Thank you for your patience.</p>
                </div>
                <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        )
    }else if(data.data.status === "confirm"){
        return (<Faces enrollmentId={props.enrollmentId} nextStep={props.nextStep}/>)
    }

    return null;
}