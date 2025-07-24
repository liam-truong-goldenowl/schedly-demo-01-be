# Schedly Back-end

Schedly is a scheduling infrastructure which makes your life easier for business meetings, webinars, seminars, online classes scheduling.

## Getting Started

These instructions will give you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - [Download](https://git-scm.com/downloads)
- **Node.js** (v22.x or newer) - [Download](https://nodejs.org/en)
- **npm** (v10.x or newer) - Comes with Node.js
- **Docker Desktop** for DB setup - [Download](https://www.docker.com/products/docker-desktop/) (optional, you can bring your own Postgres DB setup)

### Installation

Clone the repo

```sh
git clone git@github.com:liam-truong-goldenowl/schedly-demo-01-be.git
```

### Steps to Run Project

Step-by-step guide to launch and run the application in local environment.

1. Navigate to the project folder

   ```sh
   cd schedly-demo-01-be # Or your custom directory
   ```

1. Install NPM packages
   ```sh
   npm install
   ```
1. Set environment variables (if applicable)

   ```sh
   cp .env.example .env
   ```

1. Spin up Postgres DB

   ```sh
   docker compose up -d
   ```

1. Run development server
   ```sh
   npm run start:dev
   ```

### API Documentation

Visit [`localhost:3001/api/documentation`](http://localhost:3001/api/documentation) for API documentation reference.

> Make sure your local server is spin up before visit the documentation page.

### Steps to Run Tests

For unit tests:

```sh
npm run test
```

For end-to-end tests:

```sh
npm run test:e2e
```

## Architecture

### Deployment view

placeholder

### Logical view

placeholder

### Storage view (DB Diagram)

Visit [Schedly DB Diagram](https://dbdiagram.io/d/Schedly-demo-01-686e3a7df413ba3508049fc6) for interactive DB Diagram.

## Folder Structure

```sh
schedly-demo-01-be/
│
├── .github/                  # GitHub configuration files
├── .vscode/                  # VS Code config
├── dist/                     # Built directory
├── eslint.config.mjs         # ESLint config
├── commitlint.config.js      # commit-lint config
├── lefthook.yml              # Lefthook config
├── .prettierrc               # Prettier config
└── src/
│   │
│   ├── app/                  # API Server setup
│   ├── common/               # Commonly used objects
│   ├── config/               # Server configuration
│   ├── database/             # Database module
│   ├── utils/                # Utilities functions and helpers
│   ├── main.ts/              # Server entry
└── test/                     # End-to-End tests
├── .node-version             # Node.js version recommended for the project
├── docker-compose.yaml       # Docker compose
├── Dockerfile                # Docker file
├── jest.config.ts            # Jest unit testing configuration
├── mikro-orm.config.ts       # Mikro ORM configuration
├── README.md                 # README file
├── tsconfig.json             # TypeScript config
```

## Built With

The project is built with the following technologies:

- **[Nest.js](https://nestjs.com/):** A progressive Node.js framework for building efficient, scalable server-side applications using TypeScript.
- **[TypeScript](https://www.typescriptlang.org/):** A strongly typed superset of JavaScript that adds static typing to improve code quality and maintainability.
- **[Mikro ORM](https://mikro-orm.io/):** A TypeScript ORM for Node.js based on Data Mapper, Unit of Work, and Identity Map patterns, supporting PostgreSQL and other databases.
- **[Passport.js](https://www.passportjs.org/):** An authentication middleware for Node.js, providing a simple and consistent API for various authentication strategies.

## Further Documentation

References to additional documentation and resources:

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mikro ORM Documentation](https://mikro-orm.io/docs/)
- [Passport.js Guide](https://www.passportjs.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
