# Skill: spec-drafting

Standardized process for creating new phase specs. Every phase produces three
documents — `requirements.md`, `plan.md`, and `validation.md` — in the same
structure to ensure consistency across the project and portability to other
spec-driven projects.

**Rule: All spec work must be done on a branch.** Spec documents are code —
treat them with the same review, version control, and merge discipline.

---

## Workflow

### 1. Review upstream documents

Before drafting, re-read:

- **specs/roadmap.md** — confirm the phase is on the roadmap and understand
  its position in the sequence
- **specs/mission.md** — ensure the phase aligns with project purpose
- **specs/tech-stack.md** — confirm technology choices are respected
- **Previous phase validation docs** — check for `[~]` descoped items that were
  marked `→ moved to Phase N` (this phase); those are mandatory inclusions

### 2. Check for descoped items

Search all previous phase `plan.md` and `validation.md` files for the `[~]`
annotation pattern. Any item marked `[~]` with `→ moved to Phase <N>` where
`<N>` matches your phase number MUST be included in this phase's requirements.

### 3. Draft requirements.md

This document defines **what** must be built. Template:

```markdown
# Phase <N>: <Title> — Requirements

## Overview

<2-4 sentence description of what this phase delivers and why it matters.>

## In-Scope

### <Feature Area 1>
- <Requirement description, one per bullet>
- ...

### <Feature Area 2>
- <Requirement description, one per bullet>
- ...

## Out-of-Scope (explicit)

- <Item explicitly NOT in scope, to prevent scope creep>
- ...

## Responsive Design

<List which pages/features need responsive behaviour, at which breakpoints.>
Default breakpoints: 320px (mobile), 768px (tablet), 1280px (desktop).

## Acceptance Criteria

1. <Criterion that can be objectively verified>
2. ...
```

### 4. Draft plan.md

This document defines **how** it will be built, as a detailed implementation
checklist. Every checkbox item maps to a concrete deliverable.

Template:

```markdown
# Phase <N>: <Title> — Implementation Plan

## <Section 1>

- [ ] <Checkbox item — one concrete action>
- [ ] ...

## <Section 2>

- [ ] <Checkbox item>
- [ ] ...
```

**Rules:**
- Group logically: Specs → Data Model/Schema → API → UI → Tests → Docs
- Each checkbox must represent a single, mergeable unit of work
- If a section bundles multiple independent features (e.g., inline appointment
  controls that each require their own UI component, endpoint, and state
  management), split into subsections
- Items descoped to a future phase use `[~]` with `→ moved to Phase <N>`

### 5. Draft validation.md

This document defines **how to verify** the phase is complete. Every acceptance
criterion must be testable, ideally automated.

Template:

```markdown
# Phase <N>: <Title> — Validation

## <Feature Area 1>

- [ ] <Verifiable criterion>
- [ ] ...

## <Feature Area 2>

- [ ] <Verifiable criterion>
- [ ] ...

## Responsive Design

- [ ] <Breakpoint> — <what should be verified at this breakpoint>
- [ ] ...

## Test Coverage

- [ ] Unit tests for <component/hook/route> cover <scenarios>
- [ ] E2E tests for <user flow> cover <scenarios>
- [ ] Responsive E2E tests for <pages> at 320px, 768px, 1280px

## Accessibility

- [ ] <Accessibility criteria, e.g., keyboard nav, ARIA labels>

## Merge Gate

- [ ] `npm run validate` passes
- [ ] `npm run build` passes
- [ ] `npx playwright test` passes
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if setup, features, or screenshots changed)
- [ ] Screenshots captured (if UI changed)
```

**Rules:**
- Every checkbox in the plan should have at least one corresponding validation
  criterion
- Descoped items retain `[~]` with `→ moved to Phase <N>` annotation
- After the phase is implemented, checkboxes are updated to `[x]` or `[~]`

### 6. Cross-reference

Before finalizing:

- Every `plan.md` checkbox maps to at least one `validation.md` criterion
- Every `requirements.md` in-scope item is covered in `plan.md`
- Every descoped item from previous phases is either included or re-descoped
  with justification

---

## Checklist

- [ ] Roadmap reviewed and phase positioning confirmed
- [ ] Previous validation docs checked for descoped items (`[~]`)
- [ ] `requirements.md` written with in-scope/out-of-scope/acceptance criteria
- [ ] `plan.md` written with actionable checkbox items
- [ ] `validation.md` written with testable verification criteria
- [ ] Cross-reference check: plan ↔ requirements ↔ validation are aligned
- [ ] Descoped items annotated with `[~]` and `→ moved to Phase <N>`
- [ ] All three docs committed on a branch (not master)
