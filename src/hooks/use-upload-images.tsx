import {useState} from "react";

// Types
import type {HookArgs} from "../types/args.tsx";
// Hooks
import {useUploadImagesMutation} from "../store/api/core.tsx";


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
                        console.log(error);
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