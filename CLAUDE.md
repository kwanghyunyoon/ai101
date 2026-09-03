# AI 101

A free, installable PWA that teaches AI and LLM basics to non-technical adults,
finishable in one ~40-minute sitting. Trilingual: English (source), Korean,
Spanish (Latin America).

See `CONTEXT.md` for the domain glossary and `docs/adr/` for architecture decisions.

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues in `kwanghyunyoon/ai101`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
