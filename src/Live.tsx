import { useState } from "react";
import LastEvents from "./components/LastEvents";

// Icons
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { CiStreamOn } from "react-icons/ci";

// Hooks
import {useGetCameraListQuery} from "./store/api/core.tsx";
import classNames from "classnames";

const defaultCameraStreams = [
    "/sample-video1.mp4",
    "/sample-video2.mp4",
    "/sample-video3.mp4",
    "/sample-video4.mp4",
    "/sample-video5.mp4",
    "/sample-video6.mp4",
    "/sample-video7.mp4",
    "/sample-video8.mp4",
    "/sample-video9.mp4",
    "/sample-video10.mp4",
];

export default function Live() {
    const [gridSize, setGridSize] = useState({ rows: 1, cols: 1 }); // Default grid size
    const [cameraStreams] = useState(defaultCameraStreams);
    const [activeIndex, setActiveIndex] = useState(0); // Tracks active camera index for 1x1 grid
    const [sourceType, setSourceType] = useState<string>("hls");

    const {data} = useGetCameraListQuery({page:1, page_size:100});

    console.log(data)

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

    const maxVisibleStreams = gridSize.rows * gridSize.cols;

    const goToPreviousStream = () => {
        setActiveIndex((prev) => (prev === 0 ? cameraStreams.length - 1 : prev - 1));
    };

    const goToNextStream = () => {
        setActiveIndex((prev) => (prev === cameraStreams.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="flex-grow pt-16 bg-gray-100 p-4 grid grid-cols-5 gap-2">
            {/* Camera Streams Section */}
            <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CiStreamOn className="text-indigo-600"/>
                        Camera Streams
                    </h2>
                    <div>
                        <div className="flex items-center gap-2">
                            {gridOptions.map((option, index) => (
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
                    className="grid gap-2 overflow-hidden"
                    style={{
                        gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                        gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                    }}
                >
                    {/* Render Camera Grid */}
                    {gridSize.rows === 1 && gridSize.cols === 1 ? (
                        <div className="relative bg-gray-300 border rounded-md overflow-hidden">
                            <video
                                src={cameraStreams[activeIndex]} // Current video in focus
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                            ></video>
                            <div className="absolute top-0 right-0 p-2 bg-black/50 text-white text-xs rounded-bl">
                                Camera {activeIndex + 1} Source: {cameraStreams[activeIndex]}
                            </div>
                            {/* Navigation Arrows */}
                            <button
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-r-full hover:bg-black"
                                onClick={goToPreviousStream}
                            >
                                <IoIosArrowDropleftCircle/>
                            </button>
                            <button
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-l-full hover:bg-black"
                                onClick={goToNextStream}
                            >
                                <IoIosArrowDroprightCircle/>
                            </button>
                        </div>
                    ) : (
                        // Render Grid view for other sizes
                        cameraStreams.slice(0, maxVisibleStreams).map((stream, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-300 border rounded-md overflow-hidden"
                            >
                                <video
                                    src={stream}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                ></video>
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs p-1 rounded">
                                    Camera {index + 1}
                                </div>
                            </div>
                        ))
                    )}
                    {cameraStreams.length < maxVisibleStreams && gridSize.rows > 1 && (
                        <div className="col-span-full text-center text-gray-500">
                            Not enough streams to fill the grid.
                        </div>
                    )}
                </div>
            </div>

            {/* Last Events Section */}
            <LastEvents className='h-full p-0' />
        </main>
    );
}