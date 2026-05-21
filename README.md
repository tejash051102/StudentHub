# StudentHub - Student Information Management System

A full-stack student management application with JWT authentication, student/course/department management, analytics dashboard, search/filter/pagination, and a responsive modern UI.

## Tech Stack

- Frontend: React, React Router DOM, Axios, CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT authentication, bcrypt password hashing

## Modules

- Authentication
- Student Management
- Dashboard Analytics
- Course Management
- Profile Management

## Getting Started

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your MongoDB URI and JWT secret.

4. Run the app:

```bash
npm run dev
```

The frontend runs on `http://localhost:7001` and the API runs on `http://localhost:7000`.

## Default API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/profile`
- `PUT /api/profile`

# StudentHub
