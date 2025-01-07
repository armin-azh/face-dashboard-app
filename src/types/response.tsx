

export interface Response{
    message: string;
    code: string
}

export interface ListResponse<T>{
    page: number;
    page_size: number;
    results: T[]
}

export interface DataResponse<T>{
    message: string;
    code: string;
    data: T
}