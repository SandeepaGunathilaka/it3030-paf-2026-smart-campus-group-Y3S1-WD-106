# Smart Campus Operations Platform

A full-stack web application for managing campus facility bookings, resource management, and maintenance ticketing — built with **Spring Boot**, **React**, and **MySQL**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start the Database](#2-start-the-database)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Run the Backend](#4-run-the-backend)
  - [5. Run the Frontend](#5-run-the-frontend)
- [Features](#features)
- [API Overview](#api-overview)
- [Database Migrations](#database-migrations)
- [Authentication](#authentication)
- [Roles](#roles)

---

## Overview

Smart Campus provides three core modules:

| Module | Description |
|---|---|
| **Resource Booking** | Reserve lecture halls, labs, meeting rooms, and equipment |
| **Maintenance Ticketing** | Report and track campus maintenance issues |
| **Admin Dashboard** | Manage users, resources, bookings, and tickets |

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.3
- Spring Security + OAuth2 (Google)
- Spring Data JPA + Hibernate
- Flyway (database migrations)
- MySQL 8.0
- JWT (jjwt 0.11)
- Lombok

### Frontend
- React 18
- Vite 5
- React Router v6
- Axios
- Tailwind CSS
- React Hot Toast

---

## Project Structure

```
.
├── backend/                        # Spring Boot application
│   └── src/main/
│       ├── java/com/nexus/scampus/
│       │   ├── config/             # App configuration (Security, CORS, etc.)
│       │   ├── controller/         # REST controllers
│       │   ├── dto/                # Request / response DTOs
│       │   ├── exception/          # Global exception handling
│       │   ├── model/              # JPA entities & enums
│       │   ├── repository/         # Spring Data repositories
│       │   ├── security/           # JWT, OAuth2 handlers
│       │   └── service/            # Business logic
│       └── resources/
│           ├── db/migration/       # Flyway SQL migrations
│           └── application.properties
├── frontend/                       # React application
│   └── src/
│       ├── api/                    # Axios API clients
│       ├── components/             # Shared UI components
│       ├── context/                # React context (Auth)
│       └── pages/                  # Page components
└── backend/docker-compose.yml      # MySQL container
```

---

## Prerequisites

- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (or use the included `./mvnw`)
- [Node.js 18+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for the database)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth2 credentials

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd it3030-paf-2026-smart-campus-group-Y3S1-WD-106
```

### 2. Start the Database

```bash
cd backend
docker compose up -d
```

This starts MySQL 8.0 on port `3306` with:
- Database: `scampus_db`
- User: `scampus_user` / Password: `scampus_pass`

### 3. Configure Environment Variables

Create a `.env` file or export these variables before running the backend:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional overrides (defaults shown)
DB_USERNAME=scampus_user
DB_PASSWORD=scampus_pass
JWT_SECRET=your-secret-key-min-64-bytes-long
JWT_EXPIRATION_MS=86400000
FRONTEND_REDIRECT_URL=http://localhost:5173/oauth2/callback
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

**Setting up Google OAuth2:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:8080/oauth2/callback/google` as an authorised redirect URI

### 4. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Flyway will automatically run all pending migrations on startup. The API will be available at `http://localhost:8080`.

### 5. Run the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`. API requests are proxied to the backend automatically.

---

## Features

- **Google OAuth2** single sign-on
- **JWT** session management
- **Role-based access control** (User, Technician, Admin)
- Facility **booking** with conflict detection and approval workflow
- **Maintenance ticket** submission with file attachments and comments
- Real-time **notifications** for booking and ticket status changes
- **Admin dashboard** for managing all resources, bookings, users, and tickets

---

## API Overview

| Controller | Base Path | Description |
|---|---|---|
| `AuthController` | `/api/auth` | JWT token refresh, current user |
| `ResourceController` | `/api/resources` | CRUD for campus resources |
| `BookingController` | `/api/bookings` | Create, list, approve/reject bookings |
| `TicketController` | `/api/tickets` | Submit and manage maintenance tickets |
| `NotificationController` | `/api/notifications` | List and mark notifications as read |
| `AdminController` | `/api/admin` | Admin-only user and stats endpoints |

---

## Database Migrations

Migrations live in `backend/src/main/resources/db/migration/` and are run automatically by Flyway on startup.

| Version | File | Description |
|---|---|---|
| V1 | `V1__create_tables.sql` | Creates all database tables |
| V2 | `V2__seed_data.sql` | Inserts sample users, resources, bookings, and tickets |

To add a new migration, create `V3__description.sql` in the same directory.

---

## Authentication

This application uses **Google OAuth2** for authentication. The flow is:

1. User clicks "Sign in with Google" → redirected to Google
2. Google redirects back to `/oauth2/callback/google`
3. The backend validates the OAuth2 token, creates or updates the user record, and issues a **JWT**
4. The JWT is returned to the frontend via redirect to `/oauth2/callback?token=...`
5. All subsequent API requests include the JWT in the `Authorization: Bearer <token>` header

---

## Roles

| Role | Access |
|---|---|
| `USER` | Browse resources, create bookings, submit tickets, view own history |
| `TECHNICIAN` | All USER access + manage assigned tickets, add comments |
| `ADMIN` | Full access — manage users, resources, approve/reject bookings, assign tickets |
