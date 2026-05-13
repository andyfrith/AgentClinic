#!/usr/bin/env bash
set -euo pipefail

CHANGELOG="CHANGELOG.md"

# Ensure CHANGELOG exists
if [ ! -f "$CHANGELOG" ]; then
  cat > "$CHANGELOG" << 'EOF'
# Changelog

All notable changes to this project are documented below.

EOF
fi

VALID_SECTIONS="Process|Code Quality|Security|Tests|Docs|API|Data Model|UI|Infrastructure|Specs|Bug Fixes|Screenshots|Changelog"

DATE=$(date +%Y-%m-%d)

# Usage
if [ $# -eq 0 ] || [ "$1" = "--help" ]; then
  echo "Usage: $0 <entries-file|->"
  echo ""
  echo "Add changelog entries under today's date heading."
  echo ""
  echo "  <entries-file>  Path to a text file containing markdown bullet entries"
  echo "  -               Read entries from stdin"
  echo ""
  echo "Entry format (one or more):"
  echo ""
  echo "  ### Section Name"
  echo "  - Bullet describing the change"
  echo "  - Another bullet"
  echo ""
  echo "Valid section names: $VALID_SECTIONS"
  echo ""
  echo "Example:"
  echo "  echo -e \"### API\\n- Add DELETE endpoint for agents\" | $0 -"
  exit 0
fi

# Read entries
if [ "$1" = "-" ]; then
  ENTRIES=$(cat)
else
  ENTRIES=$(cat "$1")
fi

if [ -z "$ENTRIES" ]; then
  echo "Error: no entries provided" >&2
  exit 1
fi

# Validate section headings
INVALID_SECTIONS=$(echo "$ENTRIES" | grep "^### " | sed 's/^### //' | while IFS= read -r section; do
  if ! echo "$VALID_SECTIONS" | tr '|' '\n' | grep -qxF "$section"; then
    echo "$section"
  fi
done)
if [ -n "$INVALID_SECTIONS" ]; then
  echo "Error: invalid section heading(s) found:" >&2
  echo "$INVALID_SECTIONS" | sed 's/^/  /' >&2
  echo "Valid sections: $VALID_SECTIONS" >&2
  exit 1
fi

# Check if today's date heading already exists
if grep -q "^## $DATE" "$CHANGELOG"; then
  HEADING_LINE=$(grep -n "^## $DATE" "$CHANGELOG" | head -1 | cut -d: -f1)
  # Look for the next ## heading after today's section
  NEXT_HEADING_LINE=$(tail -n +$((HEADING_LINE + 1)) "$CHANGELOG" | grep -n "^## " | head -1 | cut -d: -f1 || true)

  if [ -n "$NEXT_HEADING_LINE" ]; then
    # Insert entries before the next heading
    INSERT_AT=$((HEADING_LINE + NEXT_HEADING_LINE))
    head -n $((INSERT_AT - 1)) "$CHANGELOG" > "${CHANGELOG}.tmp"
    echo "" >> "${CHANGELOG}.tmp"
    echo "$ENTRIES" >> "${CHANGELOG}.tmp"
    echo "" >> "${CHANGELOG}.tmp"
    tail -n +$INSERT_AT "$CHANGELOG" >> "${CHANGELOG}.tmp"
  else
    # No subsequent heading — append entries after existing content
    head -n $HEADING_LINE "$CHANGELOG" > "${CHANGELOG}.tmp"
    echo "" >> "${CHANGELOG}.tmp"
    echo "$ENTRIES" >> "${CHANGELOG}.tmp"
    echo "" >> "${CHANGELOG}.tmp"
    tail -n +$((HEADING_LINE + 1)) "$CHANGELOG" >> "${CHANGELOG}.tmp"
  fi
else
  # No existing date heading — prepend new section after the intro
  INTRO_LINE=$(grep -n "^All notable changes" "$CHANGELOG" | head -1 | cut -d: -f1)
  if [ -n "$INTRO_LINE" ]; then
    head -n $((INTRO_LINE + 1)) "$CHANGELOG" > "${CHANGELOG}.tmp"
  else
    head -n 0 "$CHANGELOG" > "${CHANGELOG}.tmp"
  fi
  echo "" >> "${CHANGELOG}.tmp"
  echo "## $DATE" >> "${CHANGELOG}.tmp"
  echo "" >> "${CHANGELOG}.tmp"
  echo "$ENTRIES" >> "${CHANGELOG}.tmp"
  echo "" >> "${CHANGELOG}.tmp"
  if [ -n "$INTRO_LINE" ]; then
    tail -n +$((INTRO_LINE + 2)) "$CHANGELOG" >> "${CHANGELOG}.tmp"
  else
    cat "$CHANGELOG" >> "${CHANGELOG}.tmp"
  fi
fi

mv "${CHANGELOG}.tmp" "$CHANGELOG"
echo "✓ Changelog updated under ## $DATE"
