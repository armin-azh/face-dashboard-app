
// Icons
import {GiCctvCamera} from "react-icons/gi";

// hooks
import {useGetCameraStatsQuery} from "../../store/api/core.tsx";



export default function ActiveCameras() {
    const {data, isLoading} = useGetCameraStatsQuery();
    if (isLoading || !data) return (
        <div className="bg-yellow-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
            <GiCctvCamera className="text-5xl text-yellow-500 mr-4"/>
            <div>
                <p className="text-sm">Active Cameras</p>
                <div>
                    <div role="status" className="w-full animate-pulse">
                        <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="bg-yellow-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
            <GiCctvCamera className="text-5xl text-yellow-500 mr-4"/>
            <div>
                <p className="text-sm">Active Cameras</p>
                <p className="text-3xl font-bold">{data.data.total_cameras}</p> {/* Dynamic Number */}
            </div>
        </div>
    )
}