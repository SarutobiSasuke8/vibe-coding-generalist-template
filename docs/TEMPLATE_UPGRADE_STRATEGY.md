# Template Upgrade Strategy

Template upgrades must protect user-authored project context.

## Version Metadata

The template version is stored in:

- `VERSION`
- `agentops.config.yml`

Generated files may also include a header once `agentops sync` exists.

## File Ownership Classes

| Class | Examples | Upgrade behavior |
|---|---|---|
| Generated | adapter generated sections, future CLI output | Regenerate from source, show diff |
| User-owned | `docs/PROJECT_BRIEF.md`, `TODO.md`, `ROADMAP.md`, session logs, memory files | Never overwrite silently |
| Mixed | `AGENTS.md`, `README.md`, setup checklist | Apply additive updates only when safe |

## Migration Rules

- Prefer additive changes.
- Show a dry-run diff before modifying mixed files.
- Preserve custom sections.
- Fail loudly on conflicts.
- Leave a migration summary.
- Keep fixtures for at least one previous version.

## First Upgrade Milestone

The first real upgrade path should support moving a `0.1.x` template project to `0.2.0` with:

- new docs added safely
- required-file checks updated
- no silent overwrite of project brief, TODO, roadmap, or memory files
- clear instructions for manual conflicts
