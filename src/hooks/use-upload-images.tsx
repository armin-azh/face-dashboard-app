import {useState} from "react";
import {toast} from "react-toastify";

// Types
import type {HookArgs} from "../types/args.tsx";
// Hooks
import {useUploadImagesMutation} from "../store/api/core.tsx";
import {bottomRightToastOption} from "../utils/ToastOptions.tsx";

export default function useUploadImages(){
    const [form, setForm] = useState<File[]>([]);
    const [submit, {isLoading}] = useUploadImagesMutation();

    function upload(enrollmentId: string, args: HookArgs){
        if(form.length > 0){
            const data = new FormData();
            form.forEach((file) => {
                data.append('image', file);
            });
            submit({data, enrollmentId})
                .unwrap()
                .then((response) => {
                    if(process.env.NODE_ENV === 'development'){
                        console.log(response);
                    }
                    if(args.onUpdate){
                        args.onUpdate();
                    }
                })
                .catch((error) => {
                    if(process.env.NODE_ENV === 'development'){
                        console.log('Upload error:', error);
                    }
                    // Check for 413 status code (Payload Too Large)
                    if (error?.status === 413) {
                        toast.error('File size is too large. Please upload a smaller file.', bottomRightToastOption);
                    }
                    // Check for network connectivity issues
                    else if (error?.status === 'FETCH_ERROR' || error?.error === 'TypeError: Failed to fetch') {
                        toast.error('Network connection error. Please check your internet connection and try again.', bottomRightToastOption);
                    }
                    // Handle CORS errors
                    else if (error?.error?.includes('CORS')) {
                        toast.error('Server connection error. Please try again later.', bottomRightToastOption);
                    }
                    // Handle other errors
                    else {
                        toast.error('An error occurred while uploading files. Please try again.', bottomRightToastOption);
                    }
                    if(args.onError){
                        args.onError();
                    }
                })
                .finally(() => {
                    setForm([]);
                    if(args.onFinally){
                        args.onFinally();
                    }
                })
        }
    }

    return {form, setForm, isLoading, upload};
}