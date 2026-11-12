# wen-alma

wen-engineering 的工程流，移植到 Alma 内置 agents 上运行。

**核心思想（context 经济学）**：模型 context 有限且抽帧式阅读——context 越小，注意力越准。整套流程就是围绕它设计的：

- **grill 收敛** — 分区前把决策在一个 context 里跟用户对齐，歧义不在后面每个小 context 里重复付账
- **spec 守门** — PRD Inventory fail-closed：每个最小可观察条款必须有 REQ / HITL / OUT；delta 单独成表按 id 锁定
- **票 = 冷启动分区单位** — 一张票就是一个独立会话能装下的世界，不依赖作者会话
- **隔离执行 + 独立验收** — developer 在独立 context 的 worktree 里执行；evaluator 冷启动验收，**运行时证据门**（后端起服务 curl、前端开页面看报错）没有证据不关票

## Skills

| Skill | 对应原版 | 角色 |
| --- | --- | --- |
| `wen-grill` | /grill-code | 主会话：facts sweep → 残留极点 → 决策表 |
| `wen-spec` | /to-spec | planner：会话综合成 spec，PRD Inventory 守门 |
| `wen-tickets` | /to-tickets | planner：冷启动票 → 发仓内 tracker → 回读 → ready 门 |
| `wen-implement` | /implement | developer 执行 + evaluator 运行时验收 + 关票 |
| `wen-implement-spec` | /implement-spec | 票图编排：frontier 并行、串行合并、prd-walk |

## 安装

Plugin Marketplace → Add → Add Plugin Marketplace，粘贴本仓库地址：

```
https://github.com/cswfww123/wen-alma
```

然后 Personal → wen-alma-market → Wen Alma → Install。

## 设计约定

- **tracker 永不写死**：票操作一律按目标仓 `AGENTS.md` 路由表指向的 `docs/agents/issue-tracker.md` 执行——GitHub / GitLab / 本地 markdown / codeup 由各仓自己定义
- **worktree 纪律**：一个会话绝不从两个 checkout 提交；隔离按目标仓自己的 worktree 约定（`/worktree` skill 或 `~/.agents/skills/using-git-worktrees/scripts/worktree.sh`）
- **知识注入协议**：目标仓的 AGENTS.md 路由表 + LESSONS.md 是权威，本插件只带流程不带项目知识

## 版本

0.1.0 — 初始版：五技能 + 五命令入口。
