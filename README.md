<div align="center">
  <h1>🚀 Track Expense Backend</h1>
  <p><b>Backend APIs and services for Track Expense, an open source expense tracker app.</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/NestJS-Framework-red?logo=nestjs" alt="NestJS" />
    <img src="https://img.shields.io/badge/Firebase-Auth-yellow?logo=firebase" alt="Firebase" />
    <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/TypeORM-ORM-green?logo=typeorm" alt="TypeORM" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
    <!-- Add your real CI badge here -->
    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
  </p>
  <p>
    <a href="#quickstart">Quickstart</a> •
    <a href="#features">Features</a> •
    <a href="#api-documentation">API Docs</a> •
    <a href="#documentation">Docs</a> •
    <a href="#project-structure">Structure</a>
  </p>
</div>

---

## ✨ Features

- 🔐 **Firebase Authentication**
- 👤 **User Profile Management**
- 🗄️ **PostgreSQL Database with TypeORM**
- 📊 **Expense Tracking Ready**
- 📖 **Swagger API Documentation**
- 🛡️ Modern NestJS architecture

---

## ⚡ Quickstart

### Prerequisites
- Node.js >= 20.0.0
- PostgreSQL >= 12.0
- Firebase project setup

### Setup Database
```bash
# Run the database setup script
./scripts/setup-database.sh

# Or manually create database and run migrations
# 1. Create PostgreSQL database named 'track_expense'
# 2. Run: psql -d track_expense -f src/database/migrations/001-initial-schema.sql
```

### Install & Run
```bash
git clone <repo-url>
cd expense_tracker_be
npm install
npm run start:dev
```

> ℹ️ **Tip:** Copy your Firebase service account and set up environment variables before running.

---

## 📚 API Documentation

- Interactive API docs available at: [http://localhost:3000/docs](http://localhost:3000/docs) (when running)
- Powered by Swagger UI

---

## 📄 Documentation

- [🛠️ Architecture](./docs/architecture.md)
- [🗄️ Database Setup](./docs/database-setup.md)
- [⚙️ Setup Guide](./docs/setup.md)
- [🚀 Deployment](./docs/deployment.md)
- [❓ FAQ](./docs/faq.md)
- [🐶 Husky & Commitlint](./docs/husky.md)

---

## 🗂️ Project Structure

```text
expense_tracker_be/
├── src/        # Source code (controllers, services, middleware, etc.)
├── docs/       # Project documentation
├── test/       # Tests
├── package.json
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🪪 License

[MIT](./LICENSE)

---

## 👤 Author

- 🧑‍💻 Crafted with passion by [Rajesh Mishra (RajSM139)](https://github.com/RajSM139) 
- If you like this project, drop a ⭐ on GitHub or connect with me!

---

## 🎉 Special Thanks

- 🤖 Built with a little help from my AI friend at [Cursor](https://www.cursor.so/) — coding just got a whole lot cooler!
- 🚀 Keep building, keep tracking, and stay awesome!

---

<div align="center">
  <sub>Made with ❤️ by Devs. Happy Coding!</sub>
</div>
