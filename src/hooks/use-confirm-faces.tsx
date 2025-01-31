import {useState} from "react";

// Hooks
import {useCompleteEnrollmentMutation} from "../store/api/core.tsx";

import {initEnrollmentPrimeForm} from "../types/form.tsx";

// Types
import type {HookArgs} from "../types/args.tsx";
import type {EnrollmentPrimeForm} from "../types/form.tsx";

export default function useConfirmFaces() {
    const [form, setForm] = useState<EnrollmentPrimeForm>(initEnrollmentPrimeForm);

    const [submit, {isLoading}] = useCompleteEnrollmentMutation();

    function create(enrollmentId: string, args: HookArgs) {
        submit({data: form, enrollmentId})
            .then(response=>{
                if(process.env.NODE_ENV === 'development'){
                    console.log(response);
                }
                if(args.onUpdate){
                    args.onUpdate();
                }
            })
            .catch(error=>{
                if(process.env.NODE_ENV === 'development'){
                    console.log(error);
                }
                if(args.onError){
                    args.onError();
                }
            })
            .finally(()=>{
                setForm(initEnrollmentPrimeForm);
                if(args.onFinally){
                    args.onFinally();
                }
            })
    }

    return {form, setForm, isLoading, create};
}