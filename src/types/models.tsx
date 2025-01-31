
interface File {
    id: number;
    session_id: number;
    prime: string;
    path: string;
    created_at: string;
}

interface Person {
    id: number;
    prime: string;
    first_name: string;
    last_name: string;
    created_at: string
}

interface Enrollment {
    id: number;
    prime:  string;
    type: string;
    status: string;
    person_id: number;
    created_at: string;
}

interface Event {
    event_id: number;
    event_prime: number;
    face_thumbnail: string;
    face_score: number;
    happend_at: string;
    event_created_at: string;
    camera_id: number | null;
    camera_prime: string | null;
    camera_name: string | null;
    camera_type: string | null;
    camera_url: string | null;
    camera_on_demand: boolean | null;
    person_id: number | null;
    person_prime: string | null;
    person_first_name: string | null;
    person_last_name: string | null;
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

interface Face {
    enrollment_id: number;
    enrollment_prime: string;
    session_id: number;
    face_id: number;
    enrollment_created_at: string;
    face_id_2: number;
    face_prime: string;
    face_image: string;
    face_thumbnail: string;
    face_score: string;
    face_indexed: boolean;
    session_id_2: number;
    session_prime: string;
    session_type: string;
    session_status: string;
    session_person_id: number;
    session_created_at: string;
}

interface PersonFace{
    id: number;
    prime: string;
    image: string;
    thumbnail: string;
    score: number;
    indexed: boolean;
}

export type {
    File,
    Camera,
    Enrollment,
    Person,
    CameraStats,
    Event,
    EventStats,
    PersonStats,
    EventStatusReport,
    Face,
    PersonFace,
    EventHistory};