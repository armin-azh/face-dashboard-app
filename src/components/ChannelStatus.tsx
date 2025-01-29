import classNames from "classnames";

interface Props{
    status: string;
}


export default function ChannelStatus({status}: Props) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="flex items-center gap-2">
                    <span
                        className={classNames("loader animate-spin rounded-full border-4 border-gray-300 w-8 h-8", {
                            "border-t-yellow-500": status === "connecting",
                            "border-t-red-500": status === "disconnected",
                        })}></span>
                <span className={classNames("font-semibold", {
                    "text-yellow-500": status === "connecting",
                    "text-red-500": status === "disconnected",
                })}>{status === "disconnected" ? "Disconnected" : ""}{status === 'connecting' ? 'Connecting...' : ''}</span>
            </div>
        </div>
    )
}