import {useState} from "react";
import classNames from "classnames";

// Icons
import {CiStreamOn} from "react-icons/ci";
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io";

// Hooks
import {useGetCameraListQuery} from "../store/api/core.tsx";

// Components
import Loading from "./Loading.tsx";
import HLS from '../components/Video/HLS.tsx';
import WebRTC from "./Video/WebRTC.tsx";


export default function LiveVideo(){
    const [gridSize, setGridSize] = useState({ rows: 1, cols: 1 }); // Default grid size
    const [activeIndex, setActiveIndex] = useState(0); // Tracks active camera index for 1x1 grid
    const [sourceType, setSourceType] = useState<string>("webrtc");

    const {data} = useGetCameraListQuery({page:1, page_size:100, type: "entry"});

    const gridOptions = [
        { rows: 1, cols: 1 },
        { rows: 2, cols: 2 },
        { rows: 3, cols: 3 },
        { rows: 5, cols: 5 },
        { rows: 6, cols: 5 },
    ];

    const changeGrid = (size: { rows: number; cols: number }) => {
        setGridSize(size);
    };

    if (!data){
        return <Loading/>
    }

    // if there is no data source available
    if (!data.results || data.results.length === 0) {
        return (
            <div className="flex items-center justify-center h-full col-span-4">
                <div className="aspect-w-16 aspect-h-9 w-full flex items-center justify-center text-gray-500 rounded-md">
                    No source is available
                </div>
            </div>
        );
    }

    // if there is no camera available
    if (data.results.length === 0) {
        return (
            <div className="flex items-center justify-center h-full col-span-4">
                <div
                    className="aspect-w-16 aspect-h-9 w-full  flex items-center justify-center text-gray-500 rounded-md">
                    There is no camera available
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Camera Streams Section */}
            <div className="col-span-4 bg-white p-4 rounded-lg shadow h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CiStreamOn className="text-indigo-600"/>
                        Camera Streams
                    </h2>
                    <div>
                        <div className="flex items-center gap-2">
                            {gridOptions
                                .filter((option) => data.results.length >= option.rows * option.cols)
                                .map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => changeGrid(option)}
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            gridSize.rows === option.rows && gridSize.cols === option.cols
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {option.rows}x{option.cols}
                                    </button>
                                ))}
                            <button
                                className={classNames('px-2 py-1 rounded-md text-xs font-medium',
                                    {
                                        'bg-indigo-600 text-white': sourceType === 'webrtc',
                                        'bg-gray-200 text-gray-800 hover:bg-gray-300': sourceType !== 'webrtc'
                                    })}
                                onClick={() => setSourceType("webrtc")}
                            >
                                WebRTC
                            </button>
                            <button
                                className={classNames('px-2 py-1 rounded-md text-xs font-medium',
                                    {
                                        'bg-indigo-600 text-white': sourceType === 'hls',
                                        'bg-gray-200 text-gray-800 hover:bg-gray-300': sourceType !== 'hls'
                                    })}
                                onClick={() => setSourceType("hls")}
                            >
                                HLS
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="grid gap-2 overflow-hidden flex-1"
                    style={{
                        gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                    }}
                >
                    {/* Render Camera Grid */}
                    {gridSize.rows === 1 && gridSize.cols === 1 ? (
                        <div className="relative bg-gray-300 border rounded-md overflow-hidden">
                            {sourceType === 'hls'?(
                                <HLS sourceId={data.results[activeIndex].prime}/>
                            ):(
                                <WebRTC sourceId={data.results[activeIndex].prime}/>
                            )}

                            <div className="absolute top-0 right-0 p-2 bg-black/50 text-white text-xs rounded-bl">
                                {data.results[activeIndex].name}
                            </div>
                            {/* Navigation Arrows */}
                            <button
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-r-full hover:bg-black"
                                onClick={()=>{
                                    setActiveIndex((prev) => (prev === 0 ? data.results.length - 1 : prev - 1));
                                }}
                            >
                                <IoIosArrowDropleftCircle/>
                            </button>
                            <button
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-l-full hover:bg-black"
                                onClick={()=>{
                                    setActiveIndex((prev) => (prev === data.results.length - 1 ? 0 : prev + 1));
                                }}
                            >
                                <IoIosArrowDroprightCircle/>
                            </button>
                        </div>
                    ) : (
                        // Render Grid view for other sizes
                        data.results.slice(0, gridSize.rows * gridSize.cols).map((camera, index) => (
                            <div key={index} className="relative bg-gray-300 border rounded-md overflow-hidden">
                                {sourceType === 'hls' ? (
                                    <HLS sourceId={camera.prime}/>
                                ) : (
                                    <WebRTC sourceId={camera.prime}/>
                                )}
                                <div className="absolute top-0 right-0 p-2 bg-black/50 text-white text-xs rounded-bl">
                                    {camera.name}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}