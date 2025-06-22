# Betting Dashboard

A comprehensive betting dashboard system built with microservices architecture. This project consists of multiple services that work together to provide betting analytics, odds management, and Google Sheets integration.

## 🏗️ Architecture

This project is built using a microservices architecture with the following components:

- **Bets Service**: Manages betting data and analytics
- **Google Sheets Service**: Handles Google Sheets integration for data export/import
- **Odds Service**: Manages odds data and calculations
- **Docker Compose**: Orchestrates all services for easy development and deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

### Running with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/NoxSensei/betting-sheet.git
cd betting-sheet
```

2. Set up environment variables:
```bash
cp .env-example .env
# Edit .env with your configuration
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the services:
- Bets Service: http://localhost:3001
- Google Sheets Service: http://localhost:3002
- Odds Service: http://localhost:3003

### Local Development

Each service can be run independently for development:

#### Bets Service
```bash
cd bets-service
npm install
npm run start:dev
```

#### Google Sheets Service
```bash
cd google-sheets-service
npm install
npm run start:dev
```

#### Odds Service
```bash
cd odds-service
npm install
npm run start:dev
```

## 📁 Project Structure

```
betting-dashboard/
├── bets-service/          # Betting data and analytics service
├── google-sheets-service/ # Google Sheets integration service
├── odds-service/          # Odds management service
├── docker-compose.yml     # Docker orchestration
├── .env-example          # Environment variables template
└── README.md             # This file
```

## 🔧 Configuration

Each service has its own configuration files:
- `.env-example` files in each service directory
- `docker-compose.yml` for container orchestration
- Individual `package.json` files for service-specific dependencies

## 🐳 Docker

The project includes Docker configurations for each service:
- Individual `Dockerfile` in each service directory
- `docker-compose.yml` for orchestration
- Optimized for development and production
