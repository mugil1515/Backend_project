# Backend Project — Authentication & Attendance Management System

A production-ready REST API built with **Node.js** and **Express.js** that handles user authentication (password + OTP based) and a geolocation-based employee attendance system with an admin management panel.

---

## Features

- **User Registration** — Secure sign-up with hashed passwords using bcrypt
- **Password-Based Login** — JWT token issued on successful login
- **OTP-Based Login** — One-time password sent via email using Nodemailer
- **Punch In / Punch Out** — Employees can mark attendance only within office location (geolocation-based)
- **Admin Panel APIs** — Admin can view, manage, and edit attendance records for all users
- **Input Validation** — All routes validated using express-validator
- **Secure Architecture** — JWT authentication, bcrypt hashing, CORS, cookie-parser, dotenv

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (mysql2) |
| Authentication | JWT, bcrypt |
| OTP / Email | Nodemailer |
| Validation | express-validator |
| Config | dotenv |
| Dev Tool | Nodemon |

---

## Project Structure

```
Backend_project/
├── src/
│   ├── config/          # Database connection and environment config
│   ├── controllers/     # Route handler logic (auth, attendance, admin)
│   ├── middlewares/     # JWT auth middleware, error handlers
│   ├── repository/      # Database query layer (raw SQL with mysql2)
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions (OTP generator, email sender)
│   └── validators/      # express-validator schemas for each route
├── .gitignore
├── package.json
├── package-lock.json
└── server.js            # App entry point
```

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login with email and password |
| POST | `/send-otp` | Send OTP to registered email |
| POST | `/login-otp` | Login using OTP |

### Attendance Routes — `/api/attendance`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/punch-in` | Punch in (validates office geolocation) |
| POST | `/punch-out` | Punch out (validates office geolocation) |
| GET | `/my-records` | Get logged-in user's attendance history |

### Admin Routes — `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/attendance` | View all users' attendance records |
| PUT | `/attendance/:id` | Edit a specific attendance record |

> All protected routes require `Authorization: Bearer <token>` header.

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL database running locally or remotely

### Installation

```bash
# Clone the repository
git clone https://github.com/mugil1515/Backend_project.git
cd Backend_project

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
OFFICE_LAT=your_office_latitude
OFFICE_LNG=your_office_longitude
OFFICE_RADIUS_METERS=100
```

### Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

---

## Author

**Mugi S**
- GitHub: [@mugil1515](https://github.com/mugil1515)
- LinkedIn: [linkedin.com/in/mugi-s-](https://linkedin.com/in/mugis)
- Email: mugil1504@gmail.com
