import {useState} from "react";

import {initCameraForm} from "../types/form.tsx";

// types
import type {HookArgs} from "../types/args.tsx";
import type {CameraForm} from "../types/form.tsx";

// Hooks
import {useCreateCameraMutation} from "../store/api/core.tsx";

export default function useCreateCamera() {
    const [form, setForm] = useState<CameraForm>(initCameraForm);
    const [createCamera, {isLoading}] = useCreateCameraMutation();

    function create (args: HookArgs) {

        createCamera({data: form})
            .unwrap()
            .then((response) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(response);
                }
                if (args.onUpdate) {
                    args.onUpdate();
                }
            })
            .catch((error) => {
                console.log(error);
                if (args.onError) {
                    args.onError();
                }
            })
            .finally(() => {
                setForm(initCameraForm);
                if (args.onFinally) {
                    args.onFinally();
                }
            })
    }

    return {form, setForm, isLoading, create}
}