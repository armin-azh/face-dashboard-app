import {useState} from 'react';
import {useNavigate} from "react-router";

// Hooks
import {useCreateEnrollmentMutation} from "../store/api/core.tsx";

import {initPersonEnrollmentCreateForm} from "../types/form.tsx";

// Types
import type {HookArgs} from "../types/args.tsx";
import type {PersonEnrollmentCreateForm} from "../types/form.tsx";


export default function useCreateEnrollment() {
    const navigate = useNavigate();
    const [form, setForm] = useState<PersonEnrollmentCreateForm>(initPersonEnrollmentCreateForm);
    const [submit, {isLoading}] = useCreateEnrollmentMutation();

    function create(personId:  string, args: HookArgs) {
        console.log(form)
        submit({data: form, personId})
            .unwrap()
            .then(response => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(response);
                }
                navigate(`/personals/personal/${personId}/enrollments/enrollment/${response.data.prime}`);
                if (args.onUpdate) {
                    args.onUpdate();
                }
            })
            .catch(error => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }

                if (args.onError) {
                    args.onError();
                }
            })
            .finally(() => {
                setForm(initPersonEnrollmentCreateForm);
                if (args.onFinally) {
                    args.onFinally();
                }
            })
    }

    return {form, setForm, isLoading, create}
}