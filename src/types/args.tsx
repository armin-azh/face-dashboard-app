

export interface HookArgs {
    onUpdate?: () => void;
    onError?: ()=> void;
    onFinally?: ()=>void;
}


export interface ListArgs {
    page: number;
    page_size: number
}