// This hook is responsible to create new person
import { useState } from "react";
import {toast} from "react-toastify";

import {topCenterToastOption} from "../utils/ToastOptions.tsx";
import {initPersonForm} from "../types/form.tsx";

// Types
import {PersonForm} from "../types/form.tsx";
import {HookArgs} from "../types/args.tsx";

// Hooks
import {useCreatePersonMutation} from "../store/api/core.tsx";

export default function useCreatePerson(){

    const [form, setForm] = useState<PersonForm>(initPersonForm());

    const [submit, {isLoading}] = useCreatePersonMutation();

    function create(args: HookArgs){

        const data = {...form};
        submit({data})
            .unwrap()
            .then(() =>{
                toast.success('Person created successfully', topCenterToastOption);
                if (args.onUpdate){
                    args.onUpdate();
                }

            })
            .catch(()=>{
                toast.error("Error on creating message", topCenterToastOption);
            })
            .finally(()=>{
                setForm(initPersonForm());
            })
    }


    return {form, setForm, isLoading, create}

}