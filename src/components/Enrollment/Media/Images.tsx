import {useDropzone} from 'react-dropzone';
import {useCallback} from 'react';
import {toast} from 'react-toastify';

// Hooks
import {useProcessEnrollmentMutation} from "../../../store/api/core.tsx";
import useUploadImages from "../../../hooks/use-upload-images.tsx";
import {bottomRightToastOption} from "../../../utils/ToastOptions.tsx";

interface Props {
    enrollmentId: string;
    nextStep: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export default function Images(props: Props) {
    const {form, setForm, isLoading, upload} = useUploadImages();
    const [process] = useProcessEnrollmentMutation();

    const validateFile = useCallback((file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File "${file.name}" is too large. Maximum file size is 50MB.`, bottomRightToastOption);
            return false;
        }
        return true;
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(validateFile);
        if (validFiles.length > 0) {
            setForm((prevForm) => ([...(prevForm || []), ...validFiles]));
        }
    }, [setForm, validateFile]);

    const handleRemoveFile = useCallback((index: number) => {
        setForm((prevForm) => prevForm.filter((_, i) => i !== index));
    }, [setForm]);

    const handleUpload = useCallback(() => {
        // Double check file sizes before upload
        const hasLargeFiles = form.some(file => file.size > MAX_FILE_SIZE);
        if (hasLargeFiles) {
            toast.error('Some files are too large. Maximum file size is 50MB.', bottomRightToastOption);
            return;
        }

        upload(props.enrollmentId, {
            onUpdate: () => {
                process({enrollmentId: props.enrollmentId})
                    .unwrap()
                    .then(response => {
                        if(import.meta.env.MODE === 'development'){
                            console.log('Process response:', response);
                        }
                        props.nextStep();
                    })
                    .catch(error => {
                        if(import.meta.env.MODE === 'development'){
                            console.log('Process error:', error);
                        }
                        // Handle process errors
                        if (error?.status === 'FETCH_ERROR' || error?.error === 'TypeError: Failed to fetch') {
                            toast.error('Network connection error. Please check your internet connection and try again.', bottomRightToastOption);
                        }
                        else if (error?.error?.includes('CORS')) {
                            toast.error('Server connection error. Please try again later.', bottomRightToastOption);
                        }
                        else {
                            toast.error('An error occurred while processing files. Please try again.', bottomRightToastOption);
                        }
                    });
            },
            onError: () => {
                toast.error('Failed to upload files. Please try again.', bottomRightToastOption);
            }
        });
    }, [upload, process, props.enrollmentId, props.nextStep, form]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: true
    });

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
                <p className="text-sm text-gray-500 mt-2">Maximum file size: 50MB</p>
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
                                className={`flex items-center justify-between p-2 border rounded-md shadow-sm ${
                                    file.size > MAX_FILE_SIZE ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <span className="text-gray-700">
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => handleRemoveFile(index)}
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
                onClick={handleUpload}
                disabled={isLoading}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    )
}