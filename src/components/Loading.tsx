

export default function Loading(){
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex items-center gap-2">
                    <span
                        className="loader animate-spin rounded-full border-4 border-t-blue-500 border-gray-300 w-8 h-8"></span>
                <span className="text-blue-700 font-semibold">Loading...</span>
            </div>
        </div>
    )
}