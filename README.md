# Cloud-Native Deployment Automation Platform (DevOps as a Service)

Full-stack platform that accepts a GitHub repository URL and automates build + deployment workflows.

## Project Structure

- `backend/` Fastify REST API + PostgreSQL persistence.
- `frontend/` React + Tailwind UI for login and deployment dashboard.
- `infra/terraform/` AWS provisioning templates (EC2/EKS, IAM, S3).
- `infra/monitoring/` Prometheus + Grafana monitoring stack.
- `.github/workflows/` CI/CD workflows.

## Core Features

1. **Repository Intake**: Validate GitHub URL, clone repository.
2. **Build Automation**: Generate Dockerfile if missing and build image.
3. **Infrastructure Provisioning**: Terraform apply against AWS (EC2 or EKS).
4. **CI/CD Bootstrap**: Generate GitHub Actions deploy pipeline in cloned repo.
5. **Monitoring**: Prometheus scrape + Grafana dashboards.

## Quick Start

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3) PostgreSQL

```bash
docker compose up -d postgres
```

### 4) Monitoring stack (optional)

```bash
cd infra/monitoring
docker compose up -d
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `POST /api/deployments` (JWT required)
- `GET /api/deployments` (JWT required)

## Notes

- Example auth uses plain passwords for demonstration; replace with hashing (bcrypt/argon2) for production.
- Terraform variables in `infra/terraform/variables.tf` include placeholder subnet IDs and AMI.
- Docker/Terraform/GitHub Actions steps expect proper local and AWS credentials.
