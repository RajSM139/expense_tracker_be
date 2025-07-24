# ⚙️ Setup Guide

## Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Firebase project & service account credentials
- Firestore enabled in Firebase

---

## 1. Clone the Repository
```bash
git clone https://github.com/RajSM139/expense_tracker_be.git
cd expense_tracker_be
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```
PROJECT_ID=your-firebase-project-id
PRIVATE_KEY_ID=your-private-key-id
PRIVATE_KEY=your-private-key
CLIENT_EMAIL=your-client-email
CLIENT_ID=your-client-id
```
> Get these values from your Firebase service account JSON.

## 4. Run the Server
```bash
npm run start:dev
```

- The server will start on `http://localhost:3000`
- Swagger API docs available at `/docs`

---

## 5. Linting & Commit Hooks
- Husky and Commitlint are set up to enforce code quality and commit message standards.
- See [🐶 Husky & Commitlint](./husky.md) for details.

---

> For any issues, check the FAQ or open an issue on GitHub. 