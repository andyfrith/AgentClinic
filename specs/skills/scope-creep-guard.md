# Skill: scope-creep-guard

Formalized scope creep detection and management process to be applied during
spec drafting and implementation. This skill prevents phases from growing
beyond their planned boundaries and keeps the roadmap meaningful.

This skill is designed to be generic and reusable across projects. The
principles apply regardless of domain or tech stack.

---

## When to apply

| Stage | Trigger |
|---|---|
| **Spec drafting** | While writing requirements/plan/validation for a new phase |
| **Mid-implementation** | When a task grows beyond its planned scope |
| **Code review** | When reviewing a PR that includes out-of-scope changes |

---

## Detection

### Signal patterns

Watch for these warning signs:

1. **"While I'm here" additions** — fixing a bug or adding a small feature
   that wasn't planned
2. **Feature creep in descriptions** — a requirement that starts with "wouldn't
   it be nice if..."
3. **Implied infrastructure** — "we need a new table" that implies a whole
   new set of API routes, UI pages, tests, and docs
4. **Cross-cutting concerns** — a change that touches multiple layers (schema
   + API + UI) and wasn't planned for this phase
5. **Scope ambiguity** — a requirement that's so broad it could mean 3
   different things, each with different effort

### Self-check questions

For every new item being added:

- Does this item appear in the current phase's `requirements.md` or `plan.md`?
- If not, is it truly essential for this phase to be functional?
- Could it be deferred to a later phase without breaking the current phase?
- Does this item require its own API endpoint, UI page, data model change, or
  set of tests?

---

## Response

### At spec-drafting time

If a planned section bundles multiple independent features (each requiring
their own UI component, endpoint, and state management), split them into a
separate subsequent phase rather than cramming them in.

**Action:**
1. Split the item into its own phase on the roadmap
2. Annotate the original item with `[~] → moved to Phase <N>`
3. Create a placeholder entry on the roadmap for the new phase

### During implementation

If a task grows beyond its planned scope (e.g., a "quick actions" section
becomes a multi-endpoint CRUD system):

**Action:**
1. **Pause** and flag the scope expansion
2. Document what's being added beyond the original plan
3. Propose moving the excess to a new phase on the roadmap
4. If approved: update the roadmap, annotate current specs with `[~]`,
   and stop work on the out-of-scope items
5. If rejected: revert the out-of-scope changes before merging

### During code review

If a PR contains changes that were not in the spec:

**Action:**
1. Flag the out-of-scope items in the review
2. Request they be extracted to a follow-up branch/phase
3. Do not approve the PR until out-of-scope changes are removed or justified

---

## Roadmap updates

When splitting off scope:

1. **Adjust the current phase entry** on the roadmap — narrow it to only what
   remains in scope
2. **Insert a new phase** after the current one with the descoped items
3. **Annotate** descoped items in the current plan/validation docs with `[~]`
   and `→ moved to Phase <N>`

The goal is to keep each phase a cohesive vertical slice that can ship
independently.

---

## Checklist

- [ ] Each spec item maps to the current phase's stated goals
- [ ] No "while I'm here" additions beyond scope
- [ ] If scope expanded: flagged, documented, and either deferred or
      formally added as a new roadmap phase
- [ ] Descoped items annotated with `[~] → moved to Phase <N>`
- [ ] Roadmap updated to reflect any scope changes
