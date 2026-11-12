---
name: wen-spec
description: "Synthesize the current conversation into a spec and publish it to this repo's configured tracker — no interview. PRD-sourced specs carry a PRD Inventory before accepted."
---

# Wen Spec

Turn what has **already been settled in this conversation** into a spec. Do not interview; a genuinely open product question is a residual wen-grill round, not this skill. Usually entered after a wen-grill pass; direct entry is valid — the PRD Inventory below is the fail-closed backstop either way.

## Steps

1. **Tracker is per-repo config, never hardcoded.** Follow the repo's `AGENTS.md` issue row → tracker doc. Same rule as wen-tickets.

2. **Authority rank (product doc or design pin in play).** ① active PRD (`docs/requirements/*`, `docs/prd/*`, user-named) = product-behavior baseline ② this spec and its tickets ③ accepted `相对 PRD` deltas ④ chat residual = eng seams the PRD does not own ⑤ code/tests = facts about what ships today, never a license to drop product intent. Grill AC that matches while missing unlabeled PRD behavior is **wrong AC**.

3. **PRD Inventory (fail-closed before `Status: accepted`).** Delivery source is an existing product doc or a **design pin** (原型图 / 设计稿 / pinned prototype winner / Figma frame @version) → the spec carries an Inventory table first:
   - Rows = smallest observable product clauses: numbered 验收 points, each material 场景 row, each list/edit/copy/submit rule that can fail independently.
   - **Pin rows**: every observable detail of the pin that can fail independently — fields, states (default/hover/active/disabled/loading/empty/error), conditional show/require, chrome controls, copy units, layout rules; `SRC` cites pin + region (`PIN-07 @pin v3 · 弹窗空态`); a detail visible in two states is two rows.
   - Fields: `SRC` (stable ref) / `Surface` (where a user observes it) / `REQ` (owning `REQ-xxx`, or `HITL` / `OUT`) / `Notes`.
   - **A clause that appears on two surfaces is two rows** (弹窗回显 ≠ 页外回显；提交剔除 ≠ 编辑 GET 重验).
   - Pass = every material source clause has a `REQ`, `HITL`, or explicit `OUT`. Contradiction rows stay `HITL` until the user accepts a **labeled** delta — never silently written into Accepted deltas.
   - HITL rows surfacing after a wen-grill pass → the sweep missed a pole: run **one** residual wen-grill round on exactly those rows, fold the accepted deltas, only then `accepted`.

4. **Seams before REQs.** Sketch the test seams: prefer existing seams, the highest seam possible, ideally one across the codebase. Confirm they match the user's expectations.

5. **REQ detail tier.** Pick per the change's size and announce it in one line (do not wait for approval).

6. **Dispatch the planner** (Task, `agent_id: planner`) with the handoff packet: settled decision table + scope; PRD path; accepted `相对 PRD` deltas as a **separate table** with stable ids (`D-xxx`) and class (`doc-change` | `eng-read`) — implement AC = product doc **minus only** that table; inventory rows; seams; repo layout pointers. The planner drafts:
   - Problem Statement / Solution — user's perspective.
   - User Stories — long, numbered, `As an <actor>, I want <feature>, so that <benefit>`; cover all aspects.
   - Requirements — stable `REQ-xxx` rows at the chosen tier; design source in play → named in `Delivery design pin`.
   - Implementation Decisions — modules, interfaces, schema, contracts; **no file paths or code snippets** (a prototype snippet that encodes a decision — state machine, schema, type shape — may be inlined trimmed, noted as prototype-sourced).
   - Testing Decisions — external behavior only; prior art in the codebase.
   - PRD Inventory + Accepted PRD deltas + Out of Scope + Further Notes.

7. **Publish per the tracker doc.** The spec carries no executable triage label. **Read back.** Fail-closed: a PRD-sourced spec without a complete Inventory cannot reach `Status: accepted`.

wen-tickets consumes the Inventory rows as the `Covers` sources; wen-implement's walkthrough and prd-walk grade against them.
