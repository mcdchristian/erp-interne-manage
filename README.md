# 🏢 Internal ERP - Management (Backend)

**Author:** Del'or Mutaliko
<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

This project is the backend of a modular internal ERP system designed for human resources management (employees, leaves, reports). It is built with **NestJS** and strictly follows **Clean Architecture** and **SOLID** principles, ensuring a maintainable, testable, and highly scalable codebase.

## ✨ Key Features

- **🔐 Authentication & Security (RBAC)**
  - JWT token-based authentication.
  - Role-Based Access Control (ADMIN, MANAGER, EMPLOYEE).
  - Secure password hashing using bcrypt.
- **👥 Employees Module**
  - Full management (CRUD) of company personnel.
  - Role and department segregation.
- **🏖️ Leaves Module**
  - Leave requests submission by employees.
  - Approval workflow (validation/rejection) by Managers or Admins.
- **📊 Reporting Module**
  - Cross-module data aggregation (via appropriate Repository injection).
  - Headcount statistics by department.
  - Global overview of leave statuses.

## 🏛️ Architecture

The project is structured into multiple layers adhering to Clean Architecture:

- **Domain**: Contains business Entities (e.g., `Employee`, `Leave`) and Repository Interfaces (contracts). This layer is pure and has no external dependencies.
- **Application**: Contains the Use Cases (Services) and Data Transfer Objects (DTOs). This is where the core business logic resides.
- **Infrastructure**: Implements technical details like TypeORM (TypeORM Entities and concrete Repositories), as well as authentication strategies (`JwtStrategy`).
- **Presentation**: NestJS Controllers, handling HTTP requests, validating DTOs, and formatting responses.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [Docker](https://www.docker.com/) & Docker Compose (for the PostgreSQL database)

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/mcdchristian/erp-interne-manage.git
cd erp-interne-gestion
npm install
```

### 2. Environment Configuration
An `.env` file is required at the root of the project to configure the database and the JWT key:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=erp_interne
JWT_SECRET=super-secret-key-to-change-in-production
```

### 3. Database (PostgreSQL)
Start the PostgreSQL instance via Docker Compose:
```bash
docker-compose up -d
```
*Note: Thanks to TypeORM's `synchronize: true` configuration (for development), tables are automatically generated when the application starts.*

### 4. Start the Server
Run the server in development mode:
```bash
npm run start:dev
```
The API will be accessible at `http://localhost:3000`.

### 5. Default Administrator Account
To create an initial administrator access (required to create other employees), you can run the provided seed script:
```bash
npx ts-node scripts/seed.ts
```
*Default credentials: `admin@entreprise.com` / `Password123!`*

## 📚 API Documentation (Swagger)

Once the server is started, the complete Swagger documentation interface is available at the following address:
👉 **http://localhost:3000/api/docs**

From this interface, you can visualize all endpoints, their parameters, and execute test requests (Don't forget to click the "Authorize" button to insert your JWT).

## 🧪 Testing with Postman

A ready-to-use Postman collection is provided at the root of the project: `erp_interne_postman_collection.json`.
1. Import the JSON file into Postman.
2. Open the `0. Authentification` folder and run the `Login` request with the administrator credentials.
3. An automatic script will retrieve your token and apply it to all other requests in the collection.

## 🛠️ Tech Stack & Libraries

- **NestJS** (`@nestjs/core`, `@nestjs/common`)
- **TypeORM** (`@nestjs/typeorm`, `typeorm`, `pg`)
- **Authentication** (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`)
- **Validation** (`class-validator`, `class-transformer`)
- **Documentation** (`@nestjs/swagger`, `swagger-ui-express`)
