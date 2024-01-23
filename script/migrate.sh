#!/bin/bash

if [ -z "$1" ]; then
  printf "Error: Please provide a table name for migration generation.\n"
  exit 1
fi

# Check if the Docker container is running before stopping it
if docker inspect -f '{{.State.Running}}' tfd-api-server &>/dev/null; then
  docker stop tfd-api-server
fi

cd ..

# Modify .env file to change DB_SYNC=true to false
# Modify DB_SYNC back to false
if [[ "$OS" == "Darwin" ]]; then
  # macOS/BSD system
  sed -i '' 's/DB_SYNC=true/DB_SYNC=false/' .env
else
  # Linux system
  sed -i 's/DB_SYNC=true/DB_SYNC=false/' .env
fi

# Find and delete previous migration files
previous_migration_files=$(find src/migrations -type f -name "*$1*")
if [ -n "$previous_migration_files" ]; then
  printf "Deleting previous migration files:\n%s\n" "$previous_migration_files"
  rm $previous_migration_files
fi

# Drop and recreate public database schema for PostgreSQL in Docker
docker exec -it tfd-api-db psql -U nest -d nest -c 'DROP SCHEMA public CASCADE;'
docker exec -it tfd-api-db psql -U nest -d nest -c 'CREATE SCHEMA public;'

# Re-run web server container
docker restart tfd-api-server

sleep 2

# Wait for the server to output the log message indicating successful start
while ! docker logs tfd-api-server 2>&1 | tail -n 1 | grep -q "Nest application successfully started"; do
  sleep 2
done

docker exec -it tfd-api-server yarn migration:run

# Run "docker exec -it tfd-api-server yarn migration:generate -n {GenerateTable}"
docker exec -it tfd-api-server yarn migration:generate -n "$1"

cd script

chmod +x db-restore.sh

./db-restore.sh

#Test if migration can run on existing data without problem
docker exec -it tfd-api-server yarn migration:run

cd ..

if [[ "$OS" == "Darwin" ]]; then
  # macOS/BSD system
  sed -i '' 's/DB_SYNC=false/DB_SYNC=true/' .env
else
  # Linux system
  sed -i 's/DB_SYNC=false/DB_SYNC=true/' .env
fi

printf "Migration script completed successfully.\n"
