/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_STREAM_URL: string;
    readonly VITE_CENTRIFUGO_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}