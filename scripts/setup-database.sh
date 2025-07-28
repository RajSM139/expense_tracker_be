#!/bin/bash

# Database setup script for Track Expense Backend
# This script helps you set up the PostgreSQL database

set -e

echo "🚀 Setting up PostgreSQL database for Track Expense..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) is not installed. Please install PostgreSQL first."
    exit 1
fi

# Default values
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-track_expense}

echo "📋 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Username: $DB_USERNAME"
echo "   Database: $DB_NAME"
echo ""

# Prompt for password if not set
if [ -z "$DB_PASSWORD" ]; then
    echo -n "🔐 Enter PostgreSQL password: "
    read -s DB_PASSWORD
    echo ""
fi

# Test connection
echo "🔍 Testing database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Failed to connect to PostgreSQL. Please check your credentials and try again."
    exit 1
fi

echo "✅ Database connection successful!"

# Create database if it doesn't exist
echo "🗄️  Creating database '$DB_NAME' if it doesn't exist..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "CREATE DATABASE \"$DB_NAME\" WITH OWNER = \"$DB_USERNAME\" ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;" 2>/dev/null || echo "Database already exists or creation failed (this is usually fine)"

# Run migration
echo "📝 Running database migrations..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -f src/database/migrations/001-initial-schema.sql

echo "✅ Database setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Create a .env file with your database credentials"
echo "   2. Install dependencies: npm install"
echo "   3. Start the application: npm run start:dev"
echo ""
echo "🔧 Example .env file:"
echo "   DB_HOST=localhost"
echo "   DB_PORT=5432"
echo "   DB_USERNAME=postgres"
echo "   DB_PASSWORD=your_password"
echo "   DB_NAME=track_expense"
echo "   NODE_ENV=development" 