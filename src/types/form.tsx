

export interface PersonForm{
    first_name: string;
    last_name: string;
}

export interface PersonEnrollmentCreateForm {
    type :string;
}

export const initPersonForm=()=>({first_name:'',last_name:''});

export const initPersonEnrollmentCreateForm= () =>({'type':''});