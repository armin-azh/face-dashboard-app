-- name: GetEventsList :many
SELECT 
    e.id AS event_id,
    e.prime AS event_prime,
    e.happend_at,
    e.created_at AS event_created_at,
    f.id AS face_id,
    f.prime AS face_prime,
    f.image AS face_image,
    f.thumbnail AS face_thumbnail,
    f.score AS face_score,
    c.id AS camera_id,
    c.prime AS camera_prime,
    c.name AS camera_name,
    c.type AS camera_type,
    c.url AS camera_url,
    c.on_demand AS camera_on_demand,
    p.id AS person_id,
    p.prime AS person_prime,
    p.first_name AS person_first_name,
    p.last_name AS person_last_name
FROM 
    "Event" e
LEFT JOIN 
    "Face" f ON e.face_id = f.id
LEFT JOIN 
    "Camera" c ON e.camera_id = c.id
LEFT JOIN 
    "Person" p ON e.person_id = p.id
ORDER BY 
    e.happend_at DESC
LIMIT $1 OFFSET $2;

-- name: GetEventByPrime :one
SELECT 
    e.id AS event_id,
    e.prime AS event_prime,
    e.happend_at,
    e.created_at AS event_created_at,
    f.id AS face_id,
    f.prime AS face_prime,
    f.image AS face_image,
    f.thumbnail AS face_thumbnail,
    f.score AS face_score,
    c.id AS camera_id,
    c.prime AS camera_prime,
    c.name AS camera_name,
    c.type AS camera_type,
    c.url AS camera_url,
    c.on_demand AS camera_on_demand,
    p.id AS person_id,
    p.prime AS person_prime,
    p.first_name AS person_first_name,
    p.last_name AS person_last_name
FROM 
    "Event" e
LEFT JOIN 
    "Face" f ON e.face_id = f.id
LEFT JOIN 
    "Camera" c ON e.camera_id = c.id
LEFT JOIN 
    "Person" p ON e.person_id = p.id
WHERE 
    e.prime = $1
LIMIT 1;