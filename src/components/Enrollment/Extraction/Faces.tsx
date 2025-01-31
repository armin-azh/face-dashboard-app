import {nanoid} from "@reduxjs/toolkit";

// Icons
import { FaCheck } from "react-icons/fa6";

// Components
import Loading from "../../Loading.tsx";

// Hooks
import {useGetFaceListQuery} from "../../../store/api/core.tsx";
import useConfirmFaces from "../../../hooks/use-confirm-faces.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}
export default function Faces(props: Props){

    const {data, isLoading: isFacesLoading} = useGetFaceListQuery({enrollmentId: props.enrollmentId});
    const {form, setForm, isLoading, create} = useConfirmFaces();

    if(isFacesLoading || !data){
        return <Loading/>
    }

    return (
        <div className='flex flex-col'>
            <div className="grid grid-cols-12 gap-4">
                {data?.results.map((face, index) => (
                    <div
                        key={nanoid()}
                        className={`w-full h-auto rounded-md shadow-md cursor-pointer border-2 border-transparent hover:border-blue-500 relative ${
                            form.primes.includes(face.face_prime) ? 'border-green-500' : ''
                        }`}
                        onClick={() => console.log(`Selected face ${index + 1}`)}
                    >
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/media/${face.face_image}`}
                            alt={`Face ${index + 1}`}
                            className="w-full h-auto rounded-md"
                        />
                        {form.primes.includes(face.face_prime) && (
                            <div
                                className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                                <FaCheck className='text-white'/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='flex flex-row justify-end gap-2'>
                <button
                    className='duration-300 capitalize text-sm bg-blue-500 text-white p-3 rounded-md font-medium hover:bg-blue-600'
                    onClick={()=>{
                        const allFaces = data.results.map(face => face.face_prime);
                        setForm(prevForm => ({
                            ...prevForm,
                            primes: allFaces || []
                        }));
                    }}
                >select all
                </button>
                <button
                    className='duration-300 capitalize text-sm bg-green-500 text-white p-3 rounded-md font-medium hover:bg-green-600'
                    disabled={isLoading}
                    onClick={()=>create(props.enrollmentId,{onUpdate: props.nextStep})}>confirm</button>
            </div>
        </div>

    )
}