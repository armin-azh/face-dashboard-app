

export interface Response{
    message: string;
    code: string
}

export interface ListResponse<T>{
    page: number;
    page_size: number;
    results: T[]
}