import {useState, useEffect, useRef, MutableRefObject} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {nanoid} from "@reduxjs/toolkit";
import {Centrifuge} from "centrifuge";
import classNames from "classnames";

// Icons
import { BsCameraVideoFill } from "react-icons/bs";
import { FaCircleDot } from "react-icons/fa6";
import { FaCircleStop } from "react-icons/fa6";


// Components
import Loading from "../../Loading.tsx";
import ChannelStatus from "../../ChannelStatus.tsx";
import HLS from "../../../components/Video/HLS.tsx";

// Types
import type {Props} from "./props.tsx";
import type {Camera} from "../../../types/models.tsx";

// Hooks
import {useGetCameraListQuery} from "../../../store/api/core.tsx";
import {useStartRecordingMutation} from "../../../store/api/core.tsx";


export default function Recording(props: Props){
    const ref = useRef<HTMLDivElement>(null);
    const [camIsOpen, setCamIsOpen] = useState<boolean>(false);
    const [camera, setCamera] = useState<Camera|null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [channelConnection, setChannelConnection] = useState<string>('disconnected');
    const {data, isLoading} = useGetCameraListQuery({page:1, page_size:10, type:"recording"});

    const [startRecording, {isLoading: isStartRecordingLoading}] = useStartRecordingMutation();

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
            if(message.data.action === "start-recording"){
                setIsRecording(true);
            }

            if(message.data.action === "end-recording"){
                setIsRecording(false);
            }
        });

        centrifugo.connect();
    }, []);

    useEffect(() => {
        const mutableRef = ref as MutableRefObject<HTMLDivElement | null>;

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const handleClickOutside = (event: any) => {
            if (
                mutableRef.current &&
                !mutableRef.current.contains(event.target) &&
                camIsOpen
            ) {
                setCamIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    if (isLoading || !data) return <Loading/>

    if (channelConnection === "disconnected" || channelConnection === "connecting") return <ChannelStatus status={channelConnection}/>
    return (
        <div className="flex flex-col w-1/2 mx-auto gap-3">
            {/*  Show Camera Options  */}
            <div className='w-1/3 mx-auto' ref={ref}>
                <div className='relative mt-1'>
                    <button
                        type='button'
                        className={'relative w-full flex items-center border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'}
                        aria-haspopup="listbox"
                        aria-expanded="true"
                        aria-labelledby="listbox-label"
                        onClick={()=>setCamIsOpen(prevState => !prevState)}
                    >
                        <BsCameraVideoFill className="mr-2 text-gray-700"/> <span className='text-sm'>{camera?.name ?? "Select Camera"}</span>
                    </button>
                    <AnimatePresence>
                        {camIsOpen && (
                            <motion.ul
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{ duration: 0.1 }}
                                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                tabIndex={-1}
                                role="listbox"
                                aria-labelledby="listbox-label"
                                aria-activedescendant="listbox-option-3"
                            >
                                <div className={"max-h-64 scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded scrollbar-thin "}>
                                    {data.results.map((item, index)=>{
                                        return (
                                            <li
                                                key={nanoid()}
                                                className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 flex items-center hover:bg-gray-50 transition"
                                                id="listbox-option-0"
                                                role="option"
                                                onClick={()=>{
                                                    setCamera(item);
                                                    setCamIsOpen(prevState => !prevState);
                                                }}
                                            >
                                                <span className="font-normal truncate">{index + 1}- {item.name}</span>
                                                {camera && (item.prime === camera.prime) ? (
                                                    <span className="text-blue-600 absolute inset-y-0 right-0 flex items-center pr-8">
                                                        <svg
                                                            className="h-5 w-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                          <path
                                                              fillRule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clipRule="evenodd"
                                                          />
                                                        </svg>
                                                      </span>) : null}
                                            </li>
                                        )
                                    })}
                                </div>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/*  Player  */}
            {camera &&(
                <div className="relative">
                    {isRecording && (
                        <div className={classNames('absolute top-2 right-2 bg-red-600 text-white rounded px-2 py-1 text-xs flex items-center gap-1', {'hidden': isRecording})}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 animate-ping"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <circle cx="10" cy="10" r="5"/>
                            </svg>
                            Recording
                        </div>
                    )}
                    <HLS sourceId={camera.prime}/>
                    <div className="mt-4 flex justify-center">
                        <button
                            className='duration-300 text-red-600 hover:text-red-700'
                            onClick={() => {
                                if(!isRecording && camera){
                                    startRecording({enrollmentId: props.enrollmentId, camId: camera.prime})
                                        .unwrap()
                                        .then((response)=>{
                                            if(process.env.NODE_ENV !== "production"){
                                                console.log(response);
                                            }
                                        })
                                        .catch((error)=>{
                                            if(process.env.NODE_ENV !== "production"){
                                                console.log(error);
                                            }
                                        })
                                }
                            }}
                            disabled={isStartRecordingLoading}
                        >
                            {isRecording ? <FaCircleStop size={35}/> :<FaCircleDot size={35}/>}
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}