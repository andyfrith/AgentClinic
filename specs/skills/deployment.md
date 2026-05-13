# Deployment Skill

## Platform

AgentClinic deploys to **Vercel** (cloud) with a **Neon** (Vercel Postgres) database.

## Prerequisites

- All pre-merge checks pass: `scripts/pre-merge-check.sh`
- CHANGELOG.md has entry for the release
- Screenshots have been regenerated if UI changed
- Branch has been merged to `master`
- Vercel project created and linked (one-time setup)
- GitHub secrets configured (one-time setup)

## One-Time Setup

### 1. Create Vercel project

```bash
# Install Vercel CLI
npm install -g vercel

# Login and create project
vercel login
vercel --prod
```

Follow the prompts to link your GitHub repository. Vercel will auto-detect Next.js.

### 2. Set up Neon (Vercel Postgres)

In the Vercel dashboard, go to **Storage → Create Database → Neon** or **Vercel Postgres**.
Vercel will provision a Postgres database and inject `DATABASE_URL`, `POSTGRES_URL`, etc. as environment variables automatically.

### 3. Configure GitHub secrets

Add these secrets in your GitHub repository (**Settings → Secrets and variables → Actions**):

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel API token (create at https://vercel.com/account/tokens) |

The deploy workflow will detect the project from the linked Git repository.

### 4. Run migrations

After the database is provisioned, connect to it and run migrations:

```bash
# Using Vercel CLI to pull environment
vercel env pull .env.production

# Run migrations against production
npm run db:migrate

# Seed if needed
npm run db:seed
```

Or run migrations via a one-off Vercel CLI command:

```bash
vercel run npm run db:migrate
```

## Deploying

### Via GitHub Actions (recommended)

Trigger the deploy workflow from the GitHub UI:

1. Go to **Actions → Deploy to Vercel → Run workflow**
2. Choose **production** or **preview** environment
3. Click **Run workflow**

The workflow will:
- Checkout the branch
- Install dependencies
- Deploy to Vercel with the chosen environment

Production deployments also trigger automatically on push to `master`.

### Via Vercel CLI

```bash
# Production deploy from current branch
vercel --prod

# Preview deploy
vercel
```

### Preview deployments

Each pull request automatically gets a unique preview URL from Vercel. The URL is posted as a comment on the PR when the `Deploy to Vercel` workflow is triggered, or when Vercel Git integration is enabled.

## Production Build (local testing)

```bash
# Build the application
npm run build

# Test the production build locally
npm start
```

## Database (production)

### Connection string

Vercel injects `DATABASE_URL` automatically. You can also use one of the aliases:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`

### Run migrations

Migrations must be run against the production database before the new code deploys:

```bash
npm run db:migrate
```

### Seed data (if needed)

```bash
npm run db:seed
```

## Local Production PostgreSQL

For local testing with a matching Postgres version:

```bash
docker compose -f docker-compose.prod.yml up -d
export DB_PASSWORD=<strong-password>
```

## Environment Variables

Variables are managed in the Vercel dashboard (**Project → Settings → Environment Variables**).

Required variables:

| Variable | Source | Description |
|---|---|---|
| `DATABASE_URL` | Auto-injected by Neon/Postgres integration | PostgreSQL connection string |

Optional variables (for local use):

| Variable | Description |
|---|---|
| `DB_USER` | Postgres username (default: agentclinic) |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Postgres database name (default: agentclinic) |

## Smoke Test

After deployment, verify all pages render correctly:

```bash
npx playwright test e2e/smoke.spec.ts
```

## Rollback

If a deployment fails:

1. **Vercel dashboard**: Go to **Deployments**, find the last working deployment, click the three dots → **Promote to Production**
2. **Or revert the code**: `git revert -m 1 <merge-commit>` and redeploy
3. Run smoke test to verify rollback
