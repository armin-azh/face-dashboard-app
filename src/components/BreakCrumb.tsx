import {Link} from 'react-router';

// Icons
import {AiOutlineHome, AiOutlineRight} from "react-icons/ai";

interface Item {
    to: string;
    name: string;
}

interface BreakCrumbProps {
    header: Item;
    primary: Item | string;
    secondary?: string;
}

export default function BreakCrumb(props: BreakCrumbProps) {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li>
                    <Link
                        to={props.header.to}
                        className="text-sm font-medium text-blue-700 hover:underline flex items-center capitalize">
                        <AiOutlineHome className="w-4 h-4 mr-2"/>
                        {props.header.name}
                    </Link>
                </li>
                <li>
                    <div className="flex items-center">
                        <AiOutlineRight className="w-5 h-5 text-gray-400" size={2}/>
                        {(props.primary as Item).to !== undefined ? (
                            <Link
                                to={(props.primary as Item).to}
                                className="ml-1 text-sm font-medium text-blue-700 hover:underline capitalize">
                                {(props.primary as Item).name}
                            </Link>
                        ):(
                            <span
                                className="ml-1 text-sm font-medium text-gray-500">
                                {props.primary as string}
                            </span>
                        )}
                    </div>
                </li>
                {props.secondary && (
                    <li>
                        <div className="flex items-center">
                            <AiOutlineRight className="w-6 h-6 text-gray-400"/>
                            <span
                                className="ml-1 text-sm font-medium text-gray-500">
                                {props.secondary}
                            </span>
                        </div>
                    </li>
                )}
            </ol>
        </nav>
    )
}