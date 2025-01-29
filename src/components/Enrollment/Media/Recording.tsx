
// Components
import Loading from "../../Loading.tsx";

// Hooks
import {useGetCameraListQuery} from "../../../store/api/core.tsx";
import {useEffect} from "react";
import {Centrifuge} from "centrifuge";

interface Props {
    enrollmentId: string;
}
export default function Recording(props: Props){
    const {data, isLoading} = useGetCameraListQuery({page:1, page_size:10, type:"recording"});

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
        });

        centrifugo.on('connected', ()=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(`Connected to enrollment ${props.enrollmentId} channel`);
            }
        });

        centrifugo.on('publication', (message)=>{
            if(process.env.NODE_ENV !== "production"){
                console.log(message);
            }
        });

        centrifugo.connect();
    }, []);

    if (isLoading || !data) return <Loading/>
    return (
        <></>
    )
}