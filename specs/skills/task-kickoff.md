# Skill: task-kickoff

Standardized workflow for starting any new task. This must be the first thing
an agent does before writing any code, config, or docs.

**Rule: Never start work on `master`.** The very first action must be to verify
you are NOT on master and create a dedicated branch.

---

## Workflow

### 1. Verify you are NOT on master

```bash
git branch --show-current
```

If this returns `master`, **stop immediately**. Do not write code, do not
create files, do not run generators. Create a branch first:

```bash
git checkout -b <type>/<short-description>
```

### 2. Perform due diligence

Read the following documents in order:

1. **AGENTS.md** — project conventions, branch policy, scope creep rules
2. **specs/mission.md** — project purpose and audience
3. **specs/tech-stack.md** — technologies, principles, responsive-first mandate
4. **specs/roadmap.md** — phased feature plan, what phase you're in
5. **README.md** — setup, scripts, current project state
6. **Relevant phase spec(s)** in `specs/<date>-<topic>/`:
   - `requirements.md` — what needs to be built
   - `plan.md` — how it should be built (checklist of implementation steps)
   - `validation.md` — how to verify it's done correctly

Read ALL of the above before deciding on an approach. If the task brief
conflicts with documented specs, flag the conflict rather than silently
choosing one.

### 3. Create or verify the branch

Branch naming convention: `<type>/<short-description>`

| Type | When to use |
|---|---|
| `feat/` | New feature or component |
| `fix/` | Bug fix |
| `chore/` | Tooling, config, CI, docs, skills, process |
| `refactor/` | Code restructuring without behaviour change |
| `test/` | Adding or fixing tests only |
| `docs/` | Documentation-only changes |

If you already created a branch in step 1, verify its name fits the convention.
If not, create one now:

```bash
git checkout -b <type>/<short-description>
```

### 4. Review existing code patterns

Before writing new code, study the structure of similar existing code:

- **Components**: Look at `src/components/` for similar components (naming,
  file structure, "use client" conventions, shadcn/ui usage patterns)
- **API routes**: Look at `src/app/api/` for route structure, Zod validation,
  error handling, auth patterns
- **Hooks**: Look at `src/hooks/` for TanStack Query patterns
- **Tests**: Look at `src/app/api/*/__tests__/` and `src/components/__tests__/`
  for test structure and mocking patterns
- **E2E tests**: Look at `e2e/` for Playwright test patterns

### 5. Set up the environment

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start the database
docker compose up -d

# 3. Run migrations
npm run db:migrate

# 4. Seed the database (for development)
npm run db:seed

# 5. Verify existing tests still pass
npm run test:run
```

---

## Checklist

- [ ] Verified NOT on `master` branch (`git branch --show-current`)
- [ ] Read AGENTS.md
- [ ] Read relevant spec docs (mission, tech-stack, roadmap, phase spec)
- [ ] Branch created with correct naming convention
- [ ] Existing code patterns reviewed
- [ ] Environment is running (docker, db, migrations)
- [ ] Existing tests pass before making changes
