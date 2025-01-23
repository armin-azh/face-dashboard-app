

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

interface EventStats {
    total_events: number;
}

interface PersonStats {
    total_persons: number;
}

export type { Person, CameraStats, EventStats, PersonStats };