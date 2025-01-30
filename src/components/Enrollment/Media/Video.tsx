import {useDropzone} from 'react-dropzone';

// Hooks
import useUploadVideo from "../../../hooks/useUploadVideo.tsx";

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}

export default function Video(props: Props) {
    const {form, setForm, isLoading, upload} = useUploadVideo();
    
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith("video/")) {
            setForm(file);
        } else {
            console.error("Please upload a valid video file.");
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {'video/*': []}
    });
    
    return (
        <div>
            <div {...getRootProps()}
                 className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-gray-100 cursor-pointer transition-colors duration-300 ease-in-out">
                <input {...getInputProps()} />
                {form ? (
                    <p className="text-lg font-bold text-green-500">Selected Video: {form.name}</p>
                ) : (
                    <p className="text-lg text-gray-600">Drag & drop a video file here, or click to select one</p>
                )}
            </div>
            <div className='flex justify-end'>
                <button
                    disabled={!form || isLoading}
                    className={`mt-2.5 px-5 py-2.5 rounded cursor-pointer text-sm ${
                        form ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    onClick={()=>{
                        upload(props.enrollmentId,{
                            onUpdate: ()=>{
                                props.nextStep();
                            }
                        });
                    }}>
                    Next
                </button>
            </div>
        </div>
    );
}