# Skill: update-changelog

Invoke before merging to ensure `CHANGELOG.md` is up to date.

## Workflow

Before merging, collect all changes since the last changelog entry and append them under today's date heading.

## How to invoke

### Option A: Use the script

```bash
# 1. Create an entries file describing what changed:
cat > /tmp/changelog-entries.md << 'EOF'
### Section Name
- Bullet point describing the change
- Another bullet point

### Another Section
- Change description
EOF

# 2. Run the updater:
scripts/update-changelog.sh /tmp/changelog-entries.md

# 3. Review and commit:
git add CHANGELOG.md && git commit -m "Update changelog"
```

### Option B: Pipe from stdin

```bash
scripts/update-changelog.sh - << 'EOF'
### Tests
- Add responsive e2e tests for mobile viewport
EOF
```

## Entry conventions

- **Date heading**: `## YYYY-MM-DD` (auto-managed by script)
- **Section subheadings**: `### Component/Area` (e.g. `### API`, `### UI`, `### Tests`, `### Specs`)
- **Bullets**: One line per change, past tense, imperative mood
  - Good: `- Add responsive layout to agent detail page`
  - Good: `- Fix 404 error for missing agent IDs`
  - Bad: `- Added responsive layout` (use present imperative)
  - Bad: `- Fixes` (too vague)
- Group related changes under the same section heading
- Order sections logically: Specs → API → UI → Tests

## Before merging checklist

- [ ] All commits for this branch are reflected in `CHANGELOG.md`
- [ ] Date heading matches today
- [ ] Entries are grouped by section under `###` subheadings
- [ ] `CHANGELOG.md` is staged for commit
