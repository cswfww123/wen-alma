---
name: wen-tickets
description: "Partition settled requirements into cold-start executable tickets and publish them to THIS repo's configured tracker. Dispatches the planner agent."
---

# Wen Tickets

A ticket is the unit of isolated context: each must run in a fresh session, on any machine, with no author chat. A ticket that cannot stand alone is not a ticket yet.

## Steps

1. **Tracker is per-repo config, never hardcoded.** Follow the repo's `AGENTS.md` row for filing issues — it points at the repo's tracker definition (e.g. `docs/agents/issue-tracker.md`). That file, not this skill and no default, defines where issues live and every operation (create / read / sub-issue / blocking / comment / label / close), with commands. GitHub here may be codeup or local markdown elsewhere. No such row/file → ask the user once and suggest the repo's own setup flow before inventing anything.

2. **Dispatch the planner** (Task, `agent_id: planner`). The handoff packet carries: the settled decision table + scope; PRD path and accepted `相对 PRD` deltas; the tracker conventions **verbatim** from the tracker doc; repo layout pointers; the ticket-body standard below as constraints.

3. **Cold-start ticket body standard.** Every ticket carries:
   - Repo + integration branch base; existing `file:symbol` to reuse; read-first files.
   - Behavior & fields; interface / permission / state / failure paths — literal values, not spec ids.
   - Per-row AC, each mapped to the source clause / PRD row it `Covers`; partial coverage ≠ coverage; `Supports` is not coverage.
   - Cross-cutting requirements (tenant isolation, masking, audit, idempotency, contract, UI fidelity) live in the affected ticket's own AC.
   - Exact dependencies: consumers depend on named producers' concrete outputs; a ticket's own frontend+backend run in integration order; no self-invented blockers. Parallel-safe ≠ independent — also check shared migrations / generated files / shared widgets.
   - Verification entry: commands or URLs, preconditions, login via env-var names (never secrets).
   - Blocking edges via the tracker's native dependency operations (database ids where the tracker doc says so — never issue numbers).

4. **Read back every published ticket** — number, title, body, labels, parent link, blocking edges. A publish that was not read back is a claim, not a fact.

5. **Ready gate.** Label `ready-for-agent` only after a cold-start pass: an **evaluator** agent with no author context can execute each ticket from its body alone. Missing material → `needs-info`, never ready. Label writes are read back too.
