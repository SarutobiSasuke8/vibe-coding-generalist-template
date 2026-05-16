# Project Brief Example

## Summary

Recipe Ledger is a small web app that helps home cooks save reliable weeknight recipes, track what they changed, and quickly rebuild a grocery list.

## Vibe

- Desired feeling: calm, practical, and kitchen-counter friendly.
- Reference products / experiences: simple notes apps, compact recipe cards, grocery checklists.
- Anti-vibe: glossy food magazine layout, social network, meal-plan bloat.
- First impression target: "I can save tonight's recipe and find it again fast."

## User

- Primary user: busy home cook.
- Secondary users: household members sharing a grocery list.
- User skill level: non-technical.
- Context of use: phone in kitchen, laptop during planning.

## Problem

Good personal recipe tweaks disappear into chat threads, screenshots, and memory. Users need a durable place to keep the exact version that worked.

## Product Promise

Users can save a recipe, note modifications, tag it by occasion, and generate a grocery list without managing a full meal-planning system.

## Core Workflows

1. User saves a recipe and records personal notes.
2. User searches saved recipes by ingredient, tag, or meal type.
3. User selects recipes and exports a grocery checklist.

## Success Criteria

- A recipe can be saved and found again in under one minute.
- Grocery list generation handles at least three selected recipes.
- The interface remains usable on a phone-width viewport.

## Non-Goals

- Public recipe sharing.
- Nutrition tracking.
- Delivery or grocery ordering.

## Constraints

- Time: weekend prototype.
- Budget: free-tier services only.
- Stack: TODO.
- Deployment target: TODO.
- Data sensitivity: personal notes only.
- Performance expectations: instant local search for small collections.
- Accessibility expectations: keyboard usable and readable contrast.

## Quality Gates

- Save, edit, search, and grocery-list workflows work end-to-end.
- Empty and error states exist.
- Project commands in `AGENTS.md` are accurate.
- The most important data transformation has a regression test.

## Technical Notes

- Architecture: TODO.
- Data model: recipes, ingredients, notes, tags.
- External services: none for MVP.
- Authentication/authorization: TODO.
- Observability/logging: console or lightweight event log for MVP.

## Open Questions

- [ ] #task Decide whether data starts local-only or uses a hosted database.

## References

- TODO
