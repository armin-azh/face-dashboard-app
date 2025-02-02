
interface PaginatorProps {
    nextPageDisabled: boolean,
    prevPageDisabled: boolean,
    onNextPage: () => void,
    onPrevPage: () => void,
    currentPage: number,
    totalPages: number,
}

export default function Paginator(props: PaginatorProps) {

    return (
        <div className="mt-6 flex justify-between items-center">
            <button
                className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm text-sm"
                disabled={props.prevPageDisabled}
                onClick={props.onPrevPage}
            >
                Previous
            </button>
            <span className="text-gray-700 font-semibold text-sm">
                    Page {props.currentPage} of {props.totalPages}
                </span>
            <button
                className="px-5 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 disabled:opacity-50 transition font-medium shadow-sm text-sm"
                disabled={props.nextPageDisabled}
                onClick={props.onNextPage}>
                Next
            </button>
        </div>
    )
}