PACKAGE = pet.com/gateway

init:
	migrate create -ext sql -dir src/db/migrations/main -seq init_schema
	
migrateup: 
	migrate -path src/db/migrations/main -database "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable" -verbose up

migratedown: 
	migrate -path src/db/migrations/main -database "postgresql://postgres:postgres@localhost:5432/postgres?sslmode=disable" -verbose down

dev:
	go run src/server.go

forwarding:
	go run src/data_forwarding.go

test:
	go test -v -cover ./src/...

mockgen:
	mockgen -package mockmaindb -destination src/db/mock/store.go  pet.com/gateway/src/db/sqlc/main Store

mockkafka:
	mockgen -package mockkafka -destination src/interface/mock/kafka.go  pet.com/gateway/src/interface Producer