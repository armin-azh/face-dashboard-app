

// Hooks
import {useGetEventStatusReportQuery} from "../../store/api/core.tsx";
import {IoMdPerson} from "react-icons/io";

export default function EventStatus() {

    const {data, isLoading} = useGetEventStatusReportQuery();

    if (isLoading || !data) return (
        <div className="bg-blue-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
            <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                <IoMdPerson className="text-5xl text-blue-500 mr-4"/>
                <div>
                    <p className="text-sm">Success Rate</p>
                    <div role="status" className="w-full animate-pulse">
                        <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                <IoMdPerson className="text-5xl text-red-500"/>
                <div>
                    <p className="text-sm">Unknown Rate</p>
                    <div role="status" className="w-full animate-pulse">
                        <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <div className="bg-blue-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
            <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                <IoMdPerson className="text-5xl text-blue-500 mr-4"/>
                <div>
                    <p className="text-sm">Success Rate</p>
                    <p className="text-3xl font-bold">{data.data.known_count * 100} %</p>
                </div>
            </div>
            <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                <IoMdPerson className="text-5xl text-red-500"/>
                <div>
                    <p className="text-sm">Unknown Rate</p>
                    <p className="text-3xl font-bold">{data.data.unknown_count * 100 } %</p>
                </div>
            </div>
        </div>
    )
}