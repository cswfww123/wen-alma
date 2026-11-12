---
name: wen-implement-spec
description: "Run a whole spec's ticket graph: parallel developers per frontier ticket (disjoint edits only, one worktree each), serial evaluator accept + merge + close, branch review, package prd-walk."
---

# Wen Implement Spec

The tickets are a **graph**, not a list. There is always a **frontier** of ready tickets. Each ticket runs the wen-implement protocol; this skill adds the graph, concurrency, and package close. Stay on the branch the user is already on: no new branch, no PR, no push unless explicitly asked.

## Steps

1. **Map the graph.** Read the spec + tickets: blocking edges, `Covers`, the spec's Testing Decisions, each ticket's Behavior gate / design pins. Record integration branch + run-start HEAD; intent per wen-implement §0.

2. **Frontier = tickets with every blocker closed and no assignee.** For each: write the wen-implement §2 handoff packet. UI/design-pin tickets → expand pin rows into literal style values before writing the brief.

3. **Dispatch in parallel only when edit allowlists are disjoint; overlapping tickets queue.** Each developer (Task, `agent_id: developer`) works in its own worktree created by the repo's convention — one per ticket, never reused.

4. **Per returned ticket, in order:**
   1. wen-implement §3 **accept** (evaluator; runtime evidence gate). Fail → fix handoff; after 2 rejections parent takes over or blocks.
   2. Commit in the worktree.
   3. Review by weight (`none`/`light`; a full-sized ticket gets `full`). Not-Pass → fix, accept again.
   4. **Merge** — the parent, serially, one ticket at a time, per the repo's worktree convention.
   5. **Close** per wen-implement §5: comment + evidence + commit link, close, read back. Unfinished stays open.

5. **Recompute the frontier** after each close; brief and dispatch the newly unblocked tickets.

6. **Branch review.** All tickets closed → evaluator runs a `full` review on the integration branch since run start. Fix eligible findings only — ineligible findings route to the user, never auto-fixed — via one fix handoff, then accept, commit, merge the same way.

7. **Close the package.** Every finished ticket reads back closed. PRD-sourced package → prd-walk against the **original** product doc (pin rows included). No `缺` → close the parent spec via the tracker's closeout sequence and read it back; otherwise name what holds it open.

8. **Clean up** each worktree this run created, by explicit path, with the repo's script; never bulk-delete idle worktrees or `git branch -D` by hand.
