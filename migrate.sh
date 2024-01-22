#!/bin/bash
if [ -z "$1" ]; then
  echo "Error: Please provide a table name for migration generation."
  exit 1
fi
# Modify .env file to change DB_SYNC=true to false
OS=$(uname -s)

docker stop tfd-api-server

if [[ "$OS" == "Darwin" ]]; then
  # macOS/BSD system
  sed -i '' 's/DB_SYNC=true/DB_SYNC=false/' .env
else
  # Linux system
  sed -i 's/DB_SYNC=true/DB_SYNC=false/' .env
fi

# Find and delete all previous migration files containing "Integration" in their names
previousMigrationFiles=$(find src/migrations -type f -name "*$1*")
if [ -n "$previousMigrationFiles" ]; then
  echo "Deleting previous migration files:"
  echo "$previousMigrationFiles"
  rm $previousMigrationFiles
fi


# Drop and recreate public database schema for PostgreSQL in Docker
docker exec -it tfd-api-db psql -U nest -d nest -c 'DROP SCHEMA public CASCADE;'
docker exec -it tfd-api-db psql -U nest -d nest -c 'CREATE SCHEMA public;'

# Re-run web server container
docker restart tfd-api-server

sleep 2

# Wait for the server to output the log message indicating successful start
while ! docker logs tfd-api-server 2>&1 | tail -n 1 | grep "Nest application successfully started"; do
  sleep 2
done

docker exec -it tfd-api-server yarn migration:run

# Run "docker exec -it tfd-api-server yarn fixture:generate"
# docker exec -it tfd-api-server yarn fixture:generate

# Run "docker exec -it tfd-api-server yarn migration:generate -n {GenerateTable}"
docker exec -it tfd-api-server yarn migration:generate -n $1

docker exec -it tfd-api-server yarn migration:run

# Modify DB_SYNC back to false
if [[ "$OS" == "Darwin" ]]; then
  # macOS/BSD system
  sed -i '' 's/DB_SYNC=false/DB_SYNC=true/' .env
else
  # Linux system
  sed -i 's/DB_SYNC=false/DB_SYNC=true/' .env
fi

echo "Migration script completed successfully."
