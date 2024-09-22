#!/bin/bash

# Source the .env file
if [ -f ../.env ]; then
    export $(grep -v '^#' ../.env | xargs)
else
    echo ".env file not found!"
    exit 1
fi

remote_user="nest"
remote_database="nest"

# Current script directory
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Backup file to restore
backup_file="$script_dir/backup_20240921_194400.sql"


# Perform the restore
echo "Starting PostgreSQL restore..."

# Execute the restore command
docker exec -i tfd-api-db pg_restore -U "$remote_user" -d "$remote_database" -Fc -v < "$backup_file"


# Check if the restore was successful
if [ $? -eq 0 ]; then
    echo "PostgreSQL restore completed successfully."
else
    echo "Error: PostgreSQL restore failed."
fi
