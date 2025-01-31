import {useEffect, useState} from "react";
import {Centrifuge} from "centrifuge";

// Component
import Loading from "../../Loading.tsx";
import ChannelStatus from "../../ChannelStatus.tsx";

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
        return (<></>)
    }else if(data.data.status ==="processing"){
        return (<></>)
    }else if(data.data.status === "confirm"){
        return (<></>)
    }

    return null;
}