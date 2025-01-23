

interface Person {
    id: number;
    prime: string;
    first_name: string;
    last_name: string;
    created_at: string
}


interface CameraStats {
    total_cameras: number;
}

export type { Person, CameraStats };