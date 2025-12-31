#!/bin/bash
set -e

echo "Starting Fast Bites API..."

# Run database migrations
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    alembic upgrade head || echo "Migrations skipped"
fi

# Check environment and start server accordingly
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Starting in PRODUCTION mode..."
    exec uvicorn main:app --host 0.0.0.0 --port 8004
else
    echo "Starting in DEVELOPMENT mode (hot reload enabled)..."
    exec uvicorn main:app --host 0.0.0.0 --port 8004 --reload
fi

