# Deployment Skill

## Prerequisites

- All pre-merge checks pass: `scripts/pre-merge-check.sh`
- CHANGELOG.md has entry for the release
- Screenshots have been regenerated if UI changed
- Branch has been merged to `master`

## Production Build

```bash
# Build the application
npm run build

# Test the production build locally
npm start
```

## Database

### Production PostgreSQL

Use the production Docker Compose file:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Set a strong database password:

```bash
export DB_PASSWORD=<strong-password>
```

### Connection string

```
DATABASE_URL=postgres://agentclinic:<password>@<host>:5432/agentclinic
```

### Run migrations

```bash
npm run db:migrate
```

### Seed data (if needed)

```bash
npm run db:seed
```

## Environment Variables

Required variables (copy from `.env.example`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

## Smoke Test

After deployment, verify all pages render correctly:

```bash
npx playwright test e2e/smoke.spec.ts
```

## Rollback

If deployment fails:

1. Revert the merge commit: `git revert -m 1 <merge-commit>`
2. Rebuild and redeploy
3. Run smoke test to verify rollback
