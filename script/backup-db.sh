#!/bin/bash

# Remote PostgreSQL server details
remote_host=""
remote_port=""
remote_user=""
remote_database=""

# Current script directory
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Backup file name with timestamp
backup_file="$script_dir/backup_$(date +'%Y%m%d_%H%M%S').sql"

# PostgreSQL dump command
pg_dump_cmd="docker exec -i tfd-api-db pg_dump -h $remote_host -p $remote_port -U $remote_user -d $remote_database -F c > $backup_file"

# Perform the backup
echo "Starting PostgreSQL backup..."

# Execute the backup command
eval $pg_dump_cmd

# Check if the backup was successful
if [ $? -eq 0 ]; then
    echo "PostgreSQL backup completed successfully. Backup saved to: $backup_file"
else
    echo "Error: PostgreSQL backup failed."
fi
