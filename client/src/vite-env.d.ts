/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TODO_SERVICE_CLIENT_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}