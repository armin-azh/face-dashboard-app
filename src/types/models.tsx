

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

interface EventStatusReport{
    known_count: number;
    unknown_count: number;
}

interface EventHistory{
    day_name: string;
    known_count: number;
    unknown_count: number;
    total_count: number;
}

interface Camera {
    id: number;
    prime: string;
    name: string;
    type: string;
    url: string;
    on_demand: boolean;
    created_at: string;
}

export type { Camera, Person, CameraStats, EventStats, PersonStats, EventStatusReport, EventHistory};