import {useDropzone} from 'react-dropzone';

// Hooks
import {useProcessEnrollmentMutation} from "../../../store/api/core.tsx";
import useUploadImages from "../../../hooks/use-upload-images.tsx";

interface Props {
    enrollmentId: string;
    nextStep: () => void;
}

export default function Images(props: Props) {
    console.log(props);
    const {form, setForm, isLoading, upload} = useUploadImages();
    const [process] = useProcessEnrollmentMutation();

    const onDrop = (acceptedFiles: File[]) => {
        setForm((prevForm) => ([...(prevForm || []), ...acceptedFiles]));
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'image/*': []}, multiple: true});

    return (
        <div className="p-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                    isDragActive ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                <p>Drag and drop your images here, or click to select files</p>
            </div>

            <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Selected Files:</h4>
                {form.length === 0 ? (
                    <p className="text-gray-500">No files selected</p>
                ) : (
                    <ul className="space-y-2">
                        {form.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between p-2 border border-gray-300 rounded-md shadow-sm"
                            >
                    <span className="text-gray-700">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => {
                                        setForm((prevForm) => prevForm.filter((_, i) => i !== index));
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                    isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'
                }`}
                onClick={() => upload(props.enrollmentId, {onUpdate: ()=>{

                    process({enrollmentId: props.enrollmentId})
                        .unwrap()
                        .then(response=>{
                            if(import.meta.env.MODE === 'development'){
                                console.log(response);
                            }
                            props.nextStep();
                        })
                        .catch(error=>{
                            if(import.meta.env.MODE === 'development'){
                                console.log(error);
                            }
                        })
                    }})}
                disabled={isLoading}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </div>

    )
}