# El Fuenton Backend

Backend API for the El Fuenton Point of Sale system, built with Node.js, Express, TypeScript, and PostgreSQL.

## Architecture

This project follows a clean architecture approach with the following layers:

- **Domain**: Core business logic, entities, and interfaces
- **Application**: Use cases and services that orchestrate the business logic
- **Infrastructure**: Implementation details for external services, repositories, and frameworks
- **Interfaces**: Controllers and routes that handle HTTP requests

## Setup

### Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose

### Installation

1. Clone the repository
2. Copy the `.env.example` file to `.env` and modify it if needed
3. Run the application using Docker:

```bash
docker-compose up --build

el-fuenton-backend/
├── src/
│   ├── application/        # Application services/use cases
│   ├── domain/             # Domain entities, interfaces, value objects
│   ├── infrastructure/     # Infrastructure implementations (DB, external services)
│   │   ├── database/       # Database related code
│   │   ├── repositories/   # Repository implementations
│   │   └── web/            # Web related code (controllers, routes)
│   ├── interfaces/         # Interface adapters
│   │   └── http/           # HTTP controllers and routes
│   └── server.ts           # Entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── docker-compose.yml      # Docker compose file
├── Dockerfile              # Dockerfile for backend
├── package.json            # Project dependencies
└── tsconfig.json
