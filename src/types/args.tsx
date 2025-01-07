

export interface HookArgs {
    onUpdate?: () => void;
    onError?: ()=> void;
    onFinally?: ()=>void;
}