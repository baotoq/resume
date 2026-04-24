# Resume Data Audit & Rewrite — Design

**Date:** 2026-04-24
**Target:** `src/data/resume.md`
**Goal:** Full audit + rewrite for Senior Backend Engineer role, VN + remote-global market, 1–2 pages.

## Scope

Content + light structural change only. No component/UI changes. No schema changes to `ResumeData` type.

## Changes

### 1. Bio (absorbs cut CoverGo bullet)

**New:**

> Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and champions AI-assisted development (Claude Code, agent workflows) to accelerate team delivery.

### 2. Skills — collapse to 3 buckets

**Current:** 4 keys (Programming Languages / Databases & Caching / Cloud & Infrastructure / CI/CD & DevOps). Miscategorizes React.js + Vue.js under languages. Duplicates ELK Stack.

**New:**

```yaml
skills:
  "Languages & Frameworks": "C#, ASP.NET Core, TypeScript, Go, React, Vue"
  "Data": "MySQL, MS SQL, PostgreSQL, MongoDB, Redis, Elasticsearch"
  "Cloud & DevOps": "AWS, Azure, Kubernetes, Docker, Terraform, GitHub Actions, FluxCD, GitOps"
```

### 3. Experience bullets — rewrite

**Rules applied:**

- Impact-first structure: `[Verb] [what] [scale/tech] → [outcome]`
- One strong past-tense verb per bullet (no "Deployed and Operated" pairs)
- Keep `**bold**` on verbs + hard numbers, `*italic*` on tech names
- Fill-later placeholders: `⟨N⟩` for unknown metrics at CoverGo

#### CoverGo (5 → 4 bullets; AI bullet absorbed into bio)

- **Built** *quotation engine* for **multi-tenant** insurance administration, serving ⟨N⟩ tenants.
- **Designed** *GraphQL* APIs and *Vue.js* frontends delivering **quote-to-bind** workflows for underwriters.
- **Adopted** *Dapr* for service-to-service communication across ⟨N⟩ cloud-native services, standardizing pub/sub and state management.
- **Operated** containerized workloads on *Kubernetes* with *FluxCD* GitOps on *AWS*, owning deploys end-to-end.

#### Upmesh (7 → 6 bullets; ownership + deployment merged; Terraform+ELK bullet added)

- **Built** automated *Facebook* comment capture handling **5,000 comments/sec** at peak, enabling **near real-time order processing** during live streams.
- **Designed** scalable APIs integrating *Stripe* and *3rd-party logistics*, owning **end-to-end** delivery from implementation to production.
- **Implemented** *Elasticsearch* full-text search over **millions of records**, significantly improving query latency.
- **Operated** *GitOps* workflows, *Kubernetes* clusters, and *CI/CD pipelines* on *AWS* — **reduced deploy time 75%**.
- **Pioneered** *Testcontainers* for unit + integration tests, **cutting setup time** and improving reliability.
- **Led** *Terraform*-based infrastructure provisioning and *ELK* observability across services.

#### AS White Global (4 bullets, tightened verbs)

- **Collaborated** with Product Owner and UK stakeholders to refine requirements, aligning delivery with user needs.
- **Built** responsive *React.js* portal backed by *RESTful APIs*, optimizing data flow between frontend and backend.
- **Performed** frontend + backend unit tests and **led code reviews** to maintain coding standards.
- **Established** *CI/CD pipelines* on *Azure DevOps*, enabling automated testing and deployment.

#### NashTech (5 → 4 bullets; REST+gRPC merged with portal; coverage merged with observability)

- **Built** data standardization adapter converting legacy external system data, enabling **smooth integration** with internal systems.
- **Implemented** feature-rich portal with *RESTful APIs* and *gRPC* services backing core backend workflows.
- **Implemented** real-time push notifications via *Azure SignalR* for **instant user updates**.
- **Integrated** *Grafana*, *Prometheus*, *Alert Manager*, and *Jaeger* for metrics and tracing; maintained **80% code coverage** via unit + integration tests.

## Unchanged

- `name`, `title`, `github`, `linkedin` frontmatter fields
- Experience `company`, `role`, dates, `logo_url`, `link`, `tech_stack` arrays
- Education section
- File location, frontmatter schema, `ResumeData` type

## Out of scope

- Adding metrics to CoverGo bullets (user will fill `⟨N⟩` placeholders later)
- Component/rendering changes
- New sections (Summary, Highlights, Certifications)
- ATS keyword tuning beyond current skill coverage

## Verification

- `npm run build` succeeds
- `npm run lint` clean
- Rendered page visually scans: bullet count per role 4/6/4/4, skill buckets 3, bio ≤4 lines
- No broken markdown in `**bold**`/`*italic*` pairs
