CREATE TABLE "Face" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "image" varchar(255) NOT NULL,
  "thumbnail" varchar(255) NOT NULL,
  "vector" float8[512] NOT NULL,
  "score" float NOT NULL,
  "indexed" bool NOT NULL
);

CREATE TABLE "Person" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "EnrollmentSession" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "status" varchar(255) NOT NULL,
  "person_id" bigint NOT NULL,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "Enrollment" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "session_id" bigint NOT NULL,
  "face_id" bigint UNIQUE,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "Camera" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "name" varchar(255) NOT NULL,
  "type" varchar(255) NOT NULL,
  "url" varchar(255) NOT NULL,
  "on_demand" bool NOT NULL,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "Event" (
  "id" BIGSERIAL PRIMARY KEY,
  "prime" varchar(255) UNIQUE NOT NULL,
  "person_id" bigint,
  "camera_id" bigint,
  "face_id" bigint UNIQUE,
  "happend_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT (now())
);

ALTER TABLE "EnrollmentSession" ADD FOREIGN KEY ("person_id") REFERENCES "Person" ("id") ON DELETE CASCADE;

ALTER TABLE "Enrollment" ADD FOREIGN KEY ("face_id") REFERENCES "Face" ("id");

ALTER TABLE "Enrollment" ADD FOREIGN KEY ("session_id") REFERENCES "EnrollmentSession" ("id") ON DELETE CASCADE;

ALTER TABLE "Event" ADD FOREIGN KEY ("face_id") REFERENCES "Face" ("id");

ALTER TABLE "Event" ADD FOREIGN KEY ("camera_id") REFERENCES "Camera" ("id") ON DELETE SET NULL;

ALTER TABLE "Event" ADD FOREIGN KEY ("person_id") REFERENCES "Person" ("id") ON DELETE CASCADE;