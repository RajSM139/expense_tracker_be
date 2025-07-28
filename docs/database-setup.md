# 🗄️ Database Setup Guide

This guide will help you set up PostgreSQL with TypeORM for the Track Expense backend application.

## 📋 Prerequisites

- **PostgreSQL** >= 12.0
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

## 🚀 Quick Setup

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE track_expense;
CREATE USER track_expense_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE track_expense TO track_expense_user;
\q
```

### 3. Run Setup Script

```bash
# Make script executable (if not already)
chmod +x scripts/setup-database.sh

# Run the setup script
./scripts/setup-database.sh
```

### 4. Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=track_expense_user
DB_PASSWORD=your_secure_password
DB_NAME=track_expense

# Environment
NODE_ENV=development

# Firebase Configuration (existing)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## 🏗️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    user_type VARCHAR(20) DEFAULT 'free',
    profile_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```



## 🔧 TypeORM Configuration

The application uses TypeORM with the following configuration:

```typescript
// src/config/database.config.ts
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'track_expense'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});
```

## 🗂️ Entity Structure

### User Entity
- **Primary Key**: UUID
- **Firebase UID**: Unique identifier from Firebase Auth
- **Profile Data**: JSONB field for flexible profile information
- **Verification Status**: Email and mobile verification flags
- **User Type**: Free/paid user classification



## 🔍 Database Operations

### User Operations
```typescript
// Find user by Firebase UID
const user = await userRepository.findOne({
  where: { firebaseUid: 'firebase_uid_here' }
});

// Create new user
const newUser = userRepository.create({
  firebaseUid: 'firebase_uid_here',
  email: 'user@example.com',
  // ... other fields
});
await userRepository.save(newUser);

// Update user profile
await userRepository.update(
  { firebaseUid: 'firebase_uid_here' },
  { firstName: 'John', lastName: 'Doe' }
);
```



## 🛡️ Security Considerations

1. **Environment Variables**: Never commit database credentials to version control
2. **SSL in Production**: Enable SSL for production database connections
3. **Connection Pooling**: Configure appropriate connection pool settings
4. **Input Validation**: Always validate user input before database operations
5. **SQL Injection**: TypeORM provides protection, but always use parameterized queries

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if PostgreSQL is running
   - Verify host and port settings
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check pg_hba.conf configuration
   - Ensure user has proper permissions

3. **Database Not Found**
   - Create the database manually
   - Check database name in environment variables
   - Verify user has CREATE DATABASE permission

### Useful Commands

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Connect to database
psql -h localhost -U username -d track_expense

# List databases
\l

# List tables
\dt

# Check table structure
\d table_name
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)

---

<div align="center">
  <sub>Happy coding! 🚀</sub>
</div> 