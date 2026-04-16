---

# Enrollix — Course Registration Platform

Enrollix is a full-stack course registration platform that enables students, professors, and administrators to manage academic workflows through role-based dashboards. The application supports secure authentication, course enrollment, course offering management, and system-wide administration with a modern responsive interface.

---

## Live Demo

Hosted on Vercel: https://enrollix-course-registration.vercel.app/
<img width="1914" height="911" alt="image" src="https://github.com/user-attachments/assets/3704587c-4682-4d13-b38e-4138ddb8443b" />

---

## Features

### Course Registration System (Student Dashboard)

* Browse available courses and offerings
* Enroll in courses with real-time seat validation
* Drop enrolled courses
* View enrolled courses and academic schedule

<img width="1910" height="909" alt="image" src="https://github.com/user-attachments/assets/111e92e3-6e75-48b4-bbcf-962578946465" />

### Course & Offering Management (Professor Dashboard)

* Professors can create and manage course offerings
* Assign course sections, semesters, and instructors
* Track enrolled students per course

<img width="1901" height="902" alt="image" src="https://github.com/user-attachments/assets/e69e7901-df07-4e74-91d8-38aedd64a46d" />

### Course & User Management (Admin Dashboard)

* Create and manage users (students, professors, admins)
*  Create and manage courses for system
* Soft delete and hard delete courses
* System-wide administrative control

<img width="1904" height="907" alt="image" src="https://github.com/user-attachments/assets/44bd8df2-bfe3-47f9-b227-73c0f95ebc2d" />

### Authentication & Security

* JWT-based authentication
* Secure REST APIs using Spring Security
* Role-based authorization (ADMIN / PROFESSOR / STUDENT)
* Password hashing using BCrypt

### User Experience

* Dedicated dashboards for each role
* Responsive UI with clean design
* Search and sorting functionality
* Interactive modals (Enroll, Drop, Delete)

---

## Tech Stack

### Frontend

* React
* Vite
* Axios
* Tailwind CSS
* Lucide React Icons
* Framer-motion

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate / JPA

### Database

* PostgreSQL

---

## Deployment

* Frontend: **Vercel**
* Backend: **Railway**
* Database: **Neon**

---

## Architecture

```
Enrollix Course Registration System
│
├── Frontend (React + Vite)
│   ├── Student Dashboard
│   ├── Professor Dashboard
│   ├── Admin Dashboard
│   └── Authentication UI (Login/Register Pages)
│
├── Backend (Spring Boot)
│   ├── REST API
│   ├── JWT Authentication
│   ├── Business Logic Services
│   └── Role-Based Access Control
│
└── Database (PostgreSQL)
    ├── Users
    ├── Courses
    ├── Course Offerings
    └── Enrollments
```

## Database Schema

### Main entities:

### Users

* id
* name
* email
* password
* role

### Courses

* id
* course_code
* course_name
* course_description
* credits

### Course Offerings

* id
* course_id
* professor_id
* semester
* year
* section
* capacity
* enrolled_count

### Enrollments

* id
* student_id
* offering_id
* status
* enrolled_at
* dropped_at
* completed_at

---

## Enrollment Flow

1. Student browses available course offerings
2. Student sends enrollment request
3. Backend validates seat availability
4. Enrollment is stored in database
5. UI updates with enrolled status
6. Students can drop courses anytime unless semester is done and course is graded/completed

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/enrollix-course-registration.git
cd enrollix-course-registration
```

---

### 2. Backend Setup

```bash
cd enrollix-backend
```

Configure environment variables:

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRATION=
APP_CORS_ALLOWED_ORIGIN=
```

Run backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

### 3. Frontend Setup

```bash
cd enrollix-frontend
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080/api 
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Future Improvements

* Seat tracking visualization
* Waitlist system for full courses
* Notifications system
* Real-time updates (WebSockets)
* GPA tracking and grading system
* Mobile UI enhancements

---

## Author

**Mohammed Alfarra**
Computer Science Graduate 

---
