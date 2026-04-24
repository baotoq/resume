# Resume Data Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `src/data/resume.md` per the 2026-04-24 audit spec — new bio, 3-bucket skills taxonomy, all experience bullets rewritten impact-first.

**Architecture:** Single-file YAML frontmatter edit. No schema, no component, no type changes. Data flows unchanged through `src/app/page.tsx` → `gray-matter` → `ResumeData`. Verification via `npm run build` + `npm run lint` + manual visual scan in dev server.

**Tech Stack:** YAML frontmatter, Markdown inline formatting (`**bold**`, `*italic*`), Biome (lint/format), Next.js 16 dev server.

**Spec:** `docs/superpowers/specs/2026-04-24-resume-data-audit-design.md`

---

## File Structure

**Modify only:**
- `src/data/resume.md` — YAML frontmatter, 3 logical regions: `bio`, `skills`, `experience[].bullets`

No new files. No other edits. Single atomic rewrite is possible but plan splits into 4 tasks to allow per-region review + commit.

---

### Task 1: Rewrite bio

**Files:**
- Modify: `src/data/resume.md` (the `bio:` field, currently at line 65)

- [ ] **Step 1: Open file and locate `bio:` line**

Read `src/data/resume.md`. Current bio (line 65):

```yaml
bio: "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."
```

- [ ] **Step 2: Replace bio line**

Replace the entire `bio:` line with:

```yaml
bio: "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and champions AI-assisted development (Claude Code, agent workflows) to accelerate team delivery."
```

Change: "actively integrates AI tooling" → "champions AI-assisted development (Claude Code, agent workflows)". Absorbs the cut CoverGo Claude Code bullet.

- [ ] **Step 3: Verify YAML parses**

Run: `npm run build`
Expected: build succeeds, no YAML parse errors, no TypeScript errors on `ResumeData`.

- [ ] **Step 4: Commit**

```bash
git add src/data/resume.md
git commit -m "refactor(resume): sharpen bio, fold AI tooling into narrative"
```

---

### Task 2: Collapse skills to 3 buckets

**Files:**
- Modify: `src/data/resume.md` (the `skills:` block, currently lines 60-64)

- [ ] **Step 1: Locate current skills block**

Current (lines 60-64):

```yaml
skills:
  "Programming Languages": "C#, TypeScript, Golang, ASP.NET Core, React.js, Vue.js"
  "Databases & Caching": "MySQL, MS SQL, PostgreSQL, MongoDB, Redis, Elasticsearch, ELK Stack"
  "Cloud & Infrastructure": "AWS, Azure, Kubernetes, Docker, Terraform"
  "CI/CD & DevOps": "GitHub Actions, CI/CD, FluxCD, GitOps"
```

- [ ] **Step 2: Replace entire skills block**

Replace those 5 lines with:

```yaml
skills:
  "Languages & Frameworks": "C#, ASP.NET Core, TypeScript, Go, React, Vue"
  "Data": "MySQL, MS SQL, PostgreSQL, MongoDB, Redis, Elasticsearch"
  "Cloud & DevOps": "AWS, Azure, Kubernetes, Docker, Terraform, GitHub Actions, FluxCD, GitOps"
```

Changes:
- 4 buckets → 3 buckets
- React.js → React, Vue.js → Vue, Golang → Go
- Dropped duplicate "ELK Stack" (Elasticsearch already present; ELK as observability stack surfaces in Upmesh bullet instead)
- Dropped redundant "CI/CD" token (GitHub Actions + FluxCD already imply it)

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds. The `skills` field in `ResumeData` is `Record<string, string>`, so key changes are type-safe.

- [ ] **Step 4: Visual check keys aren't hard-coded**

Run: `grep -rn "Programming Languages\|Databases & Caching\|Cloud & Infrastructure\|CI/CD & DevOps" src/`
Expected: no hits in `src/components/` or `src/app/` (keys should render dynamically via `Object.entries`). If any hit appears outside `src/data/resume.md`, STOP — component iterates over hard-coded keys. Report back.

- [ ] **Step 5: Commit**

```bash
git add src/data/resume.md
git commit -m "refactor(resume): collapse skills to 3 buckets, fix categorization"
```

---

### Task 3: Rewrite experience bullets

**Files:**
- Modify: `src/data/resume.md` (the `bullets:` arrays under each experience entry, lines 14-19, 27-34, 42-46, 54-59)

- [ ] **Step 1: Replace CoverGo bullets (lines 14-19)**

Current: 5 bullets starting "Developed quotation features..." through "Adopted Claude Code...".

Replace the entire `bullets:` block under CoverGo with:

```yaml
    bullets:
      - "**Built** *quotation engine* for **multi-tenant** insurance administration, serving ⟨N⟩ tenants."
      - "**Designed** *GraphQL* APIs and *Vue.js* frontends delivering **quote-to-bind** workflows for underwriters."
      - "**Adopted** *Dapr* for service-to-service communication across ⟨N⟩ cloud-native services, standardizing pub/sub and state management."
      - "**Operated** containerized workloads on *Kubernetes* with *FluxCD* GitOps on *AWS*, owning deploys end-to-end."
```

Count: 4 bullets (was 5; Claude Code bullet absorbed into bio in Task 1). `⟨N⟩` placeholders intentional — user will fill with real numbers later.

- [ ] **Step 2: Replace Upmesh bullets (lines 27-34)**

Current: 7 bullets. Replace the entire `bullets:` block under Upmesh with:

```yaml
    bullets:
      - "**Built** automated *Facebook* comment capture handling **5,000 comments/sec** at peak, enabling **near real-time order processing** during live streams."
      - "**Designed** scalable APIs integrating *Stripe* and *3rd-party logistics*, owning **end-to-end** delivery from implementation to production."
      - "**Implemented** *Elasticsearch* full-text search over **millions of records**, significantly improving query latency."
      - "**Operated** *GitOps* workflows, *Kubernetes* clusters, and *CI/CD pipelines* on *AWS* — **reduced deploy time 75%**."
      - "**Pioneered** *Testcontainers* for unit + integration tests, **cutting setup time** and improving reliability."
      - "**Led** *Terraform*-based infrastructure provisioning and *ELK* observability across services."
```

Count: 6 bullets (was 7; ownership+deployment bullets merged into "Designed...owning end-to-end" and "Operated...reduced deploy time").

- [ ] **Step 3: Replace AS White Global bullets (lines 42-46)**

Current: 4 bullets. Replace with:

```yaml
    bullets:
      - "**Collaborated** with Product Owner and UK stakeholders to refine requirements, aligning delivery with user needs."
      - "**Built** responsive *React.js* portal backed by *RESTful APIs*, optimizing data flow between frontend and backend."
      - "**Performed** frontend + backend unit tests and **led code reviews** to maintain coding standards."
      - "**Established** *CI/CD pipelines* on *Azure DevOps*, enabling automated testing and deployment."
```

Count: 4 bullets (unchanged count, tightened verbs).

- [ ] **Step 4: Replace NashTech bullets (lines 54-59)**

Current: 5 bullets. Replace with:

```yaml
    bullets:
      - "**Built** data standardization adapter converting legacy external system data, enabling **smooth integration** with internal systems."
      - "**Implemented** feature-rich portal with *RESTful APIs* and *gRPC* services backing core backend workflows."
      - "**Implemented** real-time push notifications via *Azure SignalR* for **instant user updates**."
      - "**Integrated** *Grafana*, *Prometheus*, *Alert Manager*, and *Jaeger* for metrics and tracing; maintained **80% code coverage** via unit + integration tests."
```

Count: 4 bullets (was 5; REST+gRPC merged with portal bullet; coverage merged with observability bullet).

- [ ] **Step 5: Verify YAML parses and types are intact**

Run: `npm run build`
Expected: build succeeds. `experience[].bullets` is `string[]`, no schema change.

- [ ] **Step 6: Commit**

```bash
git add src/data/resume.md
git commit -m "refactor(resume): rewrite experience bullets impact-first"
```

---

### Task 4: Lint, visual verify, final commit

**Files:**
- None modified; verification only.

- [ ] **Step 1: Run linter**

Run: `npm run lint`
Expected: biome check clean. If format suggestions on markdown, run `npm run format` and commit with `style(resume): biome format`.

- [ ] **Step 2: Start dev server and scan rendered page**

Run: `npm run dev` (background), open `http://localhost:3000`.

Visual checklist:
- Bio: ≤4 lines, mentions "champions AI-assisted development"
- Skills: exactly 3 bucket rows — "Languages & Frameworks", "Data", "Cloud & DevOps"
- CoverGo: 4 bullets, `⟨N⟩` placeholders visible (those are meant to be filled later)
- Upmesh: 6 bullets, "5,000 comments/sec" and "75%" still present
- AS White: 4 bullets
- NashTech: 4 bullets, "80% code coverage" still present
- `**bold**` renders bold, `*italic*` renders italic — no stray `*` characters
- Tech stack icons unchanged for each role

Stop dev server.

- [ ] **Step 3: If all visual checks pass, no further commit needed**

If `npm run format` made changes in Step 1, those are already committed. Otherwise nothing to commit.

- [ ] **Step 4: Summary check**

Run: `git log --oneline -5`
Expected: at least 3 new commits (bio, skills, bullets) on top of the spec commit `4d68bd1`.

---

## Self-Review

**Spec coverage:**
- Bio rewrite — Task 1 ✓
- Skills 3-bucket collapse + dedupe ELK — Task 2 ✓
- CoverGo 4 bullets with `⟨N⟩` placeholders — Task 3 Step 1 ✓
- Upmesh 6 bullets with Terraform+ELK line — Task 3 Step 2 ✓
- AS White 4 bullets tightened — Task 3 Step 3 ✓
- NashTech 4 bullets merged — Task 3 Step 4 ✓
- Verification: build + lint + visual — Task 4 ✓
- "Unchanged" list in spec (name/title/github/linkedin/dates/logo_url/link/tech_stack/education) — no task touches them ✓

**Placeholder scan:** `⟨N⟩` is intentional and documented in spec as fill-later. No "TBD"/"TODO"/"similar to" patterns.

**Type consistency:** `ResumeData` type unchanged; all edits are string/array values within existing schema. Skills keys are dynamic (Task 2 Step 4 verifies no hard-coded keys).

No gaps found.
