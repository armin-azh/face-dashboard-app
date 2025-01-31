

export interface PersonForm{
    first_name: string;
    last_name: string;
}

export interface PersonEnrollmentCreateForm {
    type :string;
}

export interface CameraForm{
    name: string;
    type: string;
    url: string;
    on_demand: boolean;
}

export interface EnrollmentPrimeForm {
    primes: string[];
}

export const initPersonForm=()=>({first_name:'',last_name:''});

export const initPersonEnrollmentCreateForm= () =>({'type':''});

export const initCameraForm=()=>({name:'',type:'',url:'',on_demand:false});

export const initEnrollmentPrimeForm=()=>({primes:[] as string[]});