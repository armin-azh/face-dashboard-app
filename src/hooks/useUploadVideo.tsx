import {useState} from "react";

// Hooks
import {useUploadVideoMutation} from "../store/api/core.tsx";

// Types
import type {HookArgs} from "../types/args.tsx";

export default function useUploadVideo(){
    const [form, setForm] = useState<File|null>(null);

    const [submit, {isLoading}] = useUploadVideoMutation();

    function upload(enrollmentId: string, args: HookArgs){
        const data = new FormData();
        data.append('video', form as File);
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
                setForm(null);
                if(args.onFinally){
                    args.onFinally();
                }
            })
    }
    return {form, setForm, isLoading, upload}
}