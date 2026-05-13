#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0

pass() {
  echo -e "  ${GREEN}✓${NC} $1"
  PASS=$((PASS + 1))
}

fail() {
  echo -e "  ${RED}✘${NC} $1"
  FAIL=$((FAIL + 1))
}

section() {
  echo ""
  echo -e "${BOLD}$1${NC}"
  echo "  $(printf '─%.0s' $(seq 1 60))"
}

# ──────────────────────────────────────────────
section "1/8  README"

if [ -f README.md ]; then
  if grep -q "Input from stakeholders" README.md 2>/dev/null; then
    echo "  ⚠  README.md has placeholder stakeholder content — update for developers"
  fi
  echo "  ℹ  README.md exists ($(wc -l < README.md) lines)"
  pass "README.md is present"
else
  fail "README.md is missing"
fi

# ──────────────────────────────────────────────
section "2/8  TypeScript"

if npx tsc --noEmit 2>/dev/null; then
  pass "TypeScript compiles with zero errors"
else
  fail "TypeScript has errors — run npx tsc --noEmit to see them"
fi

# ──────────────────────────────────────────────
section "3/8  Lint"

if npm run lint 2>/dev/null; then
  pass "Lint passes with no warnings"
else
  fail "Lint has warnings or errors"
fi

# ──────────────────────────────────────────────
section "4/8  Format"

if command -v npx &>/dev/null && npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}" 2>/dev/null; then
  pass "Code formatting is consistent"
else
  echo "  ℹ  Run 'npm run format' to auto-fix formatting"
  fail "Code formatting has issues"
fi

# ──────────────────────────────────────────────
section "5/8  Unit Tests"

if npm run test:run 2>/dev/null; then
  pass "All unit tests pass"
else
  fail "Some unit tests failed — run 'npm run test:run' for details"
fi

# ──────────────────────────────────────────────
section "6/8  Build"

if npm run build 2>/dev/null; then
  pass "Production build succeeds"
else
  fail "Build failed — run 'npm run build' for details"
fi

# ──────────────────────────────────────────────
section "7/8  E2E Smoke Test"

if npx playwright test e2e/smoke.spec.ts --reporter=list 2>/dev/null; then
  pass "E2E smoke test passes"
else
  echo "  ℹ  E2E smoke test failed — run 'npx playwright test e2e/smoke.spec.ts' for details"
  fail "E2E smoke test failed"
fi

# ──────────────────────────────────────────────
section "8/8  Changelog"

if [ -f CHANGELOG.md ]; then
  today=$(date +%Y-%m-%d)
  if grep -q "^## $today" CHANGELOG.md 2>/dev/null; then
    pass "Changelog has entry for today ($today)"
  else
    echo "  ⚠  No entry for today ($today) in CHANGELOG.md"
    echo "  ℹ  Run: scripts/update-changelog.sh -"
    fail "Changelog missing entry for today — add one before merging"
  fi
else
  fail "CHANGELOG.md is missing — run scripts/update-changelog.sh"
fi

# ──────────────────────────────────────────────
echo ""
echo "  $(printf '═%.0s' $(seq 1 60))"
echo -e "  ${BOLD}Results:${NC} $PASS passed, $FAIL failed"
echo ""

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
