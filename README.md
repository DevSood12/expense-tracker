# Expense Tracker & Finance Dashboard

A full-stack MERN application for tracking income and expenses, with a dashboard that summarises spending by category.

## Features

- User registration and login with JWT stored in **httpOnly cookies**
- Add, edit, and delete income/expense transactions
- Category-wise tracking with payment method and date
- Dashboard with total income, total expense, net balance, and a category doughnut chart
- Recent transactions list
- Responsive UI built with Tailwind CSS

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React (Vite), Tailwind CSS, Chart.js, Axios     |
| Backend  | Node.js, Express.js                             |
| Database | MongoDB Atlas, Mongoose                         |
| Auth     | JWT (httpOnly cookie), bcryptjs                 |

## Architecture

```
client/  React app (Context API for auth and transaction state)
server/  Express REST API
         routes -> controllers -> models, with middleware for auth and errors
```

## Key Design Decisions

- **httpOnly cookie for the JWT** instead of localStorage, so the token can't be read by injected scripts (XSS).
- **Ownership checks** on every transaction query, update, and delete, so users can only access their own data.
- **MongoDB aggregation pipeline** for dashboard totals, so summing happens in the database rather than in Node.
- **Context API** instead of Redux, since app state is small (auth and transactions).
- **Category as a plain string** with a fixed list on the frontend, to avoid an extra collection for v1.

## API Endpoints

| Method | Endpoint                  | Description                  | Auth |
| ------ | ------------------------- | ---------------------------- | ---- |
| POST   | /api/auth/register        | Register a new user          | No   |
| POST   | /api/auth/login           | Log in and set cookie        | No   |
| POST   | /api/auth/logout          | Log out and clear cookie     | Yes  |
| GET    | /api/auth/me              | Get the current user         | Yes  |
| GET    | /api/transactions         | List transactions (filters)  | Yes  |
| POST   | /api/transactions         | Create a transaction         | Yes  |
| GET    | /api/transactions/:id     | Get one transaction          | Yes  |
| PUT    | /api/transactions/:id     | Update a transaction         | Yes  |
| DELETE | /api/transactions/:id     | Delete a transaction         | Yes  |
| GET    | /api/dashboard/summary    | Totals and category breakdown| Yes  |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/DevSood12/expense-tracker.git
cd expense-tracker
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The app runs at http://localhost:5173 and the API at http://localhost:5000.

## Environment Variables

**server/.env**

| Variable    | Description                          |
| ----------- | ------------------------------------ |
| MONGO_URI   | MongoDB Atlas connection string      |
| JWT_SECRET  | Secret used to sign JWTs             |
| JWT_EXPIRE  | Token lifetime (e.g. 30d)            |
| CLIENT_URL  | Frontend origin allowed by CORS      |
| PORT        | Server port (default 5000)           |

**client/.env**

| Variable      | Description        |
| ------------- | ------------------ |
| VITE_API_URL  | Backend API base URL |

## Roadmap

- Deployment (Render + MongoDB Atlas)
- Rate limiting on auth routes
- Pagination on the transactions list
- Date-range filtering on the dashboard