# Real-Estate Listing Search API

---

A REST API for searching and browsing real-estate property listings, built with Express, TypeScript, Sequelize, and PostgreSQL.

---

## File Structure

```
.
├── src/
│   ├── server.ts                        # Express app bootstrap & HTTP server
│   ├── config/
│   │   ├── index.ts                     # Env var validation & config exports
│   │   ├── instance.ts                  # Sequelize singleton (Database class)
│   │   └── database.ts                  # Sequelize CLI config for migrations
│   ├── models/
│   │   ├── index.ts                     # Aggregates & exports all models
│   │   ├── agent.ts                     # Agent model (id, fullName, email, isAdmin…)
│   │   └── property.ts                  # Property model (title, price, suburb, type…)
│   ├── repositories/
│   │   ├── baseRepository.ts            # Generic CRUD base class
│   │   ├── agentRepository.ts           # Agent-specific data access
│   │   ├── propertyRepository.ts        # Property-specific data access
│   │   └── index.ts                     # Re-exports all repositories
│   ├── services/
│   │   ├── listingService.ts            # Filtering, sorting & role-based field stripping
│   │   └── index.ts
│   ├── controller/
│   │   ├── listingController.ts         # Route handlers: lists(), listById()
│   │   └── index.ts
│   ├── routes/
│   │   └── v1/
│   │       ├── index.ts                 # Singleton router aggregator
│   │       └── listingRoutes.ts         # GET /listings, GET /listings/:id
│   ├── middlewares/
│   │   ├── roleMiddleware.ts            # Reads x-agent-id header → sets req.isAdmin
│   │   ├── exceptionHandler.ts          # Wraps async handlers, forwards errors
│   │   ├── errorHandler.ts              # Generic & 404 error response middleware
│   │   ├── buildError.ts                # Maps error types to HTTP responses
│   │   └── index.ts
│   ├── classes/
│   │   ├── routerClass.ts               # Abstract base class for route definitions
│   │   └── index.ts
│   ├── helpers/
│   │   ├── httpError.ts                 # Custom HttpError with factory methods
│   │   ├── pagination.ts                # Pagination singleton (getQuery, getPageInfo)
│   │   └── index.ts
│   ├── enums/
│   │   ├── propertyEnum.ts              # PropertyType, ListingStatus
│   │   ├── httpStatusCodeEnum.ts        # HTTP status codes & reason phrases
│   │   ├── sortEnums.ts                 # SortEnum (ASC | DESC)
│   │   ├── environmentEnums.ts          # EnvironmentEnum
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── propertyInterface.ts         # PropertyInterface, ArgsPropertyInterface
│   │   ├── agentInterface.ts            # AgentInterface, InputAgentInterface
│   │   ├── paginationInterface.ts       # PageInfoInterface, PaginationOrderSearchExtend
│   │   ├── modelExtendInterface.ts      # ModelTimestampExtend
│   │   ├── IRouteInterface.ts           # IRouteInterface for route providers
│   │   └── index.ts
│   ├── migrations/
│   │   ├── 20260327105506-create-agents.js
│   │   └── 20260327105506-create-properties.js
│   └── seeders/
│       ├── 20260327000001-agents.js     # 3 agents (1 admin, 2 non-admin)
│       └── 20260327000002-properties.js # 20+ properties across all types/statuses
├── .env.example                         # Environment variable template
├── .env                                 # Local dev environment (git-ignored)
├── .env.docker                          # Docker environment overrides
├── .sequelizerc                         # Sequelize CLI path config
├── jest.config.ts                       # Jest + ts-jest configuration
├── Dockerfile                           # Node 20 slim image, builds TypeScript
├── docker-compose.yml                   # PostgreSQL + API services
├── package.json
└── tsconfig.json
```

## Docker Setup

The quickest way to get the full stack running — no local Node.js or PostgreSQL required.

### 1. Configure the Docker environment

The `.env.docker` file is pre-configured and used by the API container. Review and adjust values if needed:

```dotenv
APP_NAME=Real-State-Listing-Api
APP_PORT=7001
APP_ENVIRONMENT=development
APP_HOST_URL=http://localhost:7001
CORS_WHITE_LIST=http://127.0.0.1:7001,http://localhost:7001

DB_HOST=postgresdb        # matches the docker-compose service name
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=real_state_listing_development_db
DB_DIALECT=postgres
```

### 2. Build and start all services

```bash
docker-compose up --build
```

This starts two services:
- `postgresdb` — PostgreSQL 17.5 on port `5432`
- `real-state-listing-api` — the API on port `7001`

### 3. Run migrations inside the container

```bash
docker-compose exec real-state-listing-api npm run sequelize db:migrate
```

### 4. Seed the database

```bash
docker-compose exec real-state-listing-api npm run sequelize db:seed:all
```

### 5. Verify the API is running

```bash
curl http://localhost:7001/api/v1/listings
```

### Useful Docker commands

```bash
# Start in detached mode
docker-compose up -d --build

# View API logs
docker-compose logs -f real-state-listing-api

# Stop all services
docker-compose down

# Stop and remove volumes (wipes the database)
docker-compose down -v

# Rebuild only the API image
docker-compose build real-state-listing-api
```

---

## Local Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```dotenv
# Application
APP_NAME=real-estate-api
APP_PORT=7001
APP_ENVIRONMENT=development
APP_HOST_URL=http://localhost:7001
APP_URL=http://localhost:7001
CORS_WHITE_LIST=http://localhost:7001,http://127.0.0.1:7001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=real_estate_dev
DB_DIALECT=postgres
```

### 3. Run database migrations

```bash
yarn sequelize db:migrate
```

### 4. Seed the database

```bash
yarn sequelize db:seed:all
```

This inserts 3 agents (1 admin, 2 non-admin) and 20+ properties covering all property types, listing statuses, suburbs, and price ranges.

### 5. Start the server

```bash
yarn start:dev
```

The API will be available at `http://localhost:7001`.

---

## GET /api/v1/listings — Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: `1`) |
| `limit` | integer | Results per page (default: `10`, max: `100`) |
| `order` | string | Column to sort by (default: `id`) |
| `sort` | `ASC` \| `DESC` | Sort direction (default: `DESC`) |
| `suburb` | string | Filter by suburb — case-insensitive match |
| `price_min` | number | Minimum price (inclusive) |
| `price_max` | number | Maximum price (inclusive) |
| `bedrooms` | integer | Minimum number of bedrooms |
| `bathrooms` | integer | Minimum number of bathrooms |
| `property_type` | enum | One of: `house`, `apartment`, `townhouse`, `land`, `commercial`, `rural` |
| `keyword` | string | Case-insensitive substring match on `title` or `description` |
| `listing_status` | enum | One of: `active`, `under_offer`, `sold`, `leased`, `withdrawn` |

All parameters are optional and combined with AND logic.

---

## Example API Calls

### 1. List with filters

Fetch page 1 of active houses in Northside with at least 3 bedrooms, priced between $500k and $1.2M:

```bash
curl "http://localhost:7001/api/v1/listings?suburb=Northside&property_type=house&bedrooms=3&price_min=500000&price_max=1200000&listing_status=active&page=1&limit=5"
```

Expected response:

```json
{
  "data": [
    {
      "id": 3,
      "title": "Spacious Family Home in Northside",
      "suburb": "Northside",
      "price": "850000.00",
      "bedrooms": 4,
      "bathrooms": 2,
      "propertyType": "house",
      "listingStatus": "active",
      "agent": {
        "id": 2,
        "fullName": "Alice Smith",
        "email": "alice@realestate.com"
      }
    }
  ],
  "pageInfo": {
    "count": 1,
    "total": 1,
    "limit": 5,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

### 2. Detail by ID

Fetch a single listing by its ID:

```bash
curl "http://localhost:7001/api/v1/listings/3"
```

Expected response:

```json
{
  "data": {
    "id": 3,
    "title": "Spacious Family Home in Northside",
    "description": "A beautiful 4-bedroom home...",
    "addressLine": "12 Oak Street",
    "suburb": "Northside",
    "state": "NSW",
    "postcode": "2000",
    "price": "850000.00",
    "bedrooms": 4,
    "bathrooms": 2,
    "carSpaces": 2,
    "propertyType": "house",
    "listingStatus": "active",
    "agent": {
      "id": 2,
      "fullName": "Alice Smith",
      "email": "alice@realestate.com"
    }
  }
}
```

### 3. Admin vs normal user response

Normal user — `internalStatusNotes` is excluded:

```bash
curl "http://localhost:7001/api/v1/listings/3"
```

Admin user — pass the `x-agent-id` header for an agent with `is_admin: true` (agent ID 1 in seed data):

```bash
curl "http://localhost:7001/api/v1/listings/3" -H "x-agent-id: 1"
```

Admin response additionally includes:

```json
{
  "data": {
    "id": 3,
    "internalStatusNotes": "Vendor motivated — price negotiable",
    ...
  }
}
```

If the `x-agent-id` header is missing, references a non-admin agent, or references a non-existent agent, the caller is treated as a normal user and `internalStatusNotes` is omitted.

---

## Running the Test Suite

```bash
yarn test
```

Tests run with Jest in band (sequentially) against a dedicated test database. Make sure `NODE_ENV=test` and a `.env.test` file are configured with a separate test database before running.

To run a single test file:

```bash
yarn test tests/listings.test.ts
```
