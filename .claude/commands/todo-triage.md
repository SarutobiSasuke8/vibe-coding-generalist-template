Read `TODO.md`. If it does not exist, say so and stop.

Triage every item into one of three buckets:

**Now** — blocks current work, has a clear owner, or is fast and high-value.
**Soon** — valuable but not urgent; needs a little more context or a decision first.
**Parking lot** — speculative, stale, or dependent on something far out.

For each Now item, add:
- A one-line success criterion (what does "done" look like?)
- A suggested first action (command to run, file to read, question to answer)

Output format:

```
## Now
- [ ] <item> — <success criterion> | first action: <action>

## Soon
- [ ] <item>

## Parking lot
- [ ] <item>
```

Do not rewrite TODO.md unless the user asks. Surface the triage only.

If TODO.md is empty or has fewer than three items, say so and suggest what recurring categories belong there based on `AGENTS.md` and `docs/PROJECT_BRIEF.md`.
