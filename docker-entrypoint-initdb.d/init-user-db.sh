#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE recipeapp;
    CREATE USER recipeadmin WITH PASSWORD password;
    GRANT ALL PRIVILEGES ON DATABASE recipeapp TO recipeadmin;
EOSQL