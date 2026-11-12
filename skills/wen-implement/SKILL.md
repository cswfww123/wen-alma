---
name: wen-implement
description: "Execute one ticket in an isolated context: developer agent in a dedicated worktree, independent evaluator acceptance with runtime evidence, merge, close. No runtime evidence → no close."
---

# Wen Implement

One ticket, one isolated context, one worktree. The **developer** executes; the **evaluator** accepts — different contexts on purpose: the accepter never shares the implementer's sunk cost. Done means walkthrough-proven with runtime evidence; tests-green + diff-looks-right is not Done on its own.

## Steps

0. **Enter.** Fetch the ticket via the repo's tracker conventions (`AGENTS.md` row → tracker doc); state its title before starting. Read what the repo's `AGENTS.md` names for code changes (LESSONS.md, code standards). Record intent: PRD path, design source, accepted `相对 PRD` deltas, the `Covers` rows. A `Covers` row whose ticket body still lists 残差 / partial → split a follow-up ticket or accept a labeled delta; closing is unavailable.

1. **Isolate.** One worktree per ticket, following the repo's own worktree convention (its `AGENTS.md` / worktree skill / `~/.agents/skills/using-git-worktrees/scripts/worktree.sh new <slug>`). Never two sessions in one checkout. Record the integration branch. Docs-only or no-commit runs may stay in the main checkout.

2. **Brief = handoff packet.** Dispatch **developer** (Task, `agent_id: developer`). Packet:
   - `goal`: final AC with literal values.
   - `constraints`: edit boundaries; do-not-touch; existing symbols to reuse; the real source of truth for domain facts (the table/service a sibling path uses — no config stand-ins); log points on async / webhook / MQ / state-machine paths.
   - `deliverable`: working code + tests at the named seams + walkthrough evidence files.
   - `acceptanceCriteria`: per-AC verify command + expected value; the `Already failing` baseline list.
   - `artifactRefs`: ticket body, spec section, PRD rows, read-first files.

   One ticket per spawn. A mechanical ≤2-file slice → the parent may edit directly (note `confidence: degraded`).

3. **Accept — evaluator, not the parent.** Dispatch **evaluator** (Task, `agent_id: evaluator`) with the ticket AC + the developer's report. The report is a claim; every check runs for real, in the worktree:
   - Re-run each verify command; exit codes match; only `Already failing` tests fail.
   - `git diff --name-only <base>` within the edit allowlist; no stray files; no TODO/FIXME/`@Disabled`/`@ts-ignore`/`as any`/weakened or skipped assertions in the diff.
   - **Runtime evidence gate (the close blocker):** backend ticket → start the app (the repo's standalone/local profile) and curl the real endpoints; capture status + bodies. Frontend ticket → run the dev server and open the page (Preview/browser); capture console errors and per-AC observations. One walkthrough row per Covered AC: action → expected → observed evidence. A row reported `blocked (env: …)` → the evaluator confirms the missing fact itself (runs the startup/login step) before reporting.
   - **Design-pin acceptance is row-by-row, never "looks close":** when pin rows exist, every `做` row is its own walkthrough row with the pin's literal values (size, color, position, state set, copy, interaction). The evaluator captures the implemented state for each row and compares against the pin — a screenshot cannot waive a row. Any `做` row without its own evidence is a finding, and the ticket does not close. Regions the implementer rewrote are the highest-risk rows, not the safest.
   - **Same-context self-check is not acceptance.** The implementer may verify to catch mistakes, but the accept verdict comes from a context that did not write the code. If no evaluator is available, say so and mark the run `confidence: degraded` — never self-certify a walkthrough.
   - New tests demonstrably fail for the AC's reason (S2), or GREEN-baseline evidence for no-behavior slices.

   Verdict: per-check pass/fail table + evidence. Failed check → fix handoff to the developer naming the check and its exact output. After 2 rejections the parent takes over or blocks.

4. **Review by weight.** `none` (requires a one-line seam justification) | `light` | `full` (money / schema / wire / UI-fidelity tickets get `full`). The evaluator runs it against `<base>..HEAD` with intent evidence (PRD path, design pins). Not-Pass with in-scope fixes → fix handoff, then accept again.

5. **Merge & close.** Merge per the repo's worktree convention; clean up with its script — never bulk-delete; cleanup must refuse dirty or unmerged worktrees. Close via the tracker doc's sequence: comment acceptance + evidence + review verdict + commit link → close → **read back**; Done is invalid while it still reads open. PRD-sourced `Covers` → mini prd-walk of this ticket's rows against the original PRD; any `缺` → follow-up ticket or labeled accepted delta, and the ticket stays open.

## Done report

task/ticket/source paths; dispatch trace (developer + evaluator ids, or parent-fallback `confidence: degraded`); per-check results with runtime evidence; review weight + verdict; commit link; ticket state as read back.
