---
name: wen-grill
description: "Clarify a requirement with the user before partitioning it: facts-first sweep, residual poles only under a PRD, settle in chat. Runs in the main conversation."
---

# Wen Grill

Converge user–model consensus in ONE context **before** partitioning. Every ambiguity left open here multiplies across every ticket context spawned later. Decisions are cheapest in this thread.

## Steps

1. **Classify first.**
   - Fuzzy product need (worth-doing, target user, market, "what should we build?") → stop; that is PM territory. Come back when the package is settled.
   - Good enough to code against (named AC, bug, settled multi-slice, an existing PRD) → continue. Default LIGHT; do not open pipelines to look thorough.

2. **Read the environment.** The repo's `AGENTS.md` router names the files to read for this kind of work (LESSONS.md, rules, subsystem docs) — read what it names. Facts first, non-blocking: map the tables, live write paths, tests, and contract seals the requirement touches. Prefer code over stale process docs. Non-trivial sweep → dispatch a **researcher** agent. A sibling checkout owns a surface → read its `AGENTS.md` too, per its cross-repo table.

3. **PRD in play?** (`docs/requirements/*`, `docs/prd/*`, or a doc the user treats as the PRD) → it is the product baseline:
   - Grill **residual poles only**: two PRD rows that cannot both be true, a term with no live column, an eng seam the PRD does not own. Never re-author settled rows.
   - A recommendation that narrows or changes PRD behavior must be labeled `相对 PRD` + class (`doc-change` | `eng-read`). Unlabeled `按推荐` does not override the PRD.
   - Zero open poles after the sweep → skip the interview; go straight to wen-tickets (or wen-implement for a single slice).

4. **Frontier rounds.** One batch table per round: 5–8 open decisions (max 10), each with a recommended pole (`❓` / `➡️`). Recompute after the user's answers. First surface includes the MVP boundary — in scope / explicitly out / open risks — accept or diff before expanding. High-risk rows first: money & stats 口径, historical backfill, dual write paths, irreversible schema/wire renames, shared-branch blast radius. The user rubber-stamps the full table twice → next round carries only 2–3 high-risk decisions, forcing an explicit choice.
   - Wrong human in the room (product/business/ops the user does not own) → park those rows; offer a questionnaire for the owner. Never invent Expected / market / user value.
   - Conflict facts (one field, several live values across enums / write paths / SQL) → post a fact table (source → value → role); put the alignment target on the frontier with a recommendation. Never "code wins" silently.

5. **Close.** Every row answered (`按推荐` or a diff). Restate: settled table, in/out scope, what the walkthrough must prove. Same-session work stays in chat — no decision file. Handoff to other sessions/agents → decisions go **into the tickets** (wen-tickets), not a parallel rotting doc.

## Do not

- Interview the user to pick skills — classify and route yourself.
- Open grill/tickets/specs for a single clear slice (→ wen-implement directly).
- Create decision/ADR/glossary files by default; a term truly changing → the repo's domain flow, once.
