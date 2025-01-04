import { IoIosNotifications } from "react-icons/io";


export default function Notification(){

    return <div className='duration-300 border border-indigo-400 p-1.5 rounded-md shadow-sm bg-transparent hover:bg-indigo-400 text-indigo-400 hover:text-gray-800 hover:cursor-pointer'>
        <IoIosNotifications size={20}/>
    </div>
}