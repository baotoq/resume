# Phase 9: Type System & Data Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 09-type-system-data-foundation
**Areas discussed:** Bio content, EducationEntry field set, Education data content

---

## Bio content

| Option | Description | Selected |
|--------|-------------|----------|
| Results-focused | No pronouns, leads with experience and domain | ✓ |
| Narrative / first-person | "I build...", conversational | |
| You write it | Verbatim user-provided text | |

**Lead choice:** Years of experience + domain (vs. scale-first or stack-first)

**Length:** 2 sentences (vs. 3-4)

**Differentiator:** All of the above compressed — scale + operational ownership + AI tooling in sentence 2

| Draft option | Selected |
|---|---|
| Use the proposed draft | ✓ |
| Tweak wording | |
| Write it myself | |

**User's choice:** Approved draft verbatim:
> "Senior backend engineer with 7+ years building distributed systems — .NET, Go, and Kubernetes-native architectures across insurance, e-commerce, and enterprise platforms. Designed high-throughput event pipelines, owned systems end-to-end from implementation to production, and actively integrates AI tooling to accelerate team delivery."

---

## EducationEntry field set

| Option | Description | Selected |
|--------|-------------|----------|
| details?: string[] | Bullet-point coursework list | |
| link?: string | University website URL | ✓ |
| logo_url?: string | University logo | ✓ |
| Nothing extra | 4 required fields only | |

**User's choice:** `logo_url?` and `link?` as optional fields. No `details` field.

**Coursework follow-up:**

| Option | Description | Selected |
|--------|-------------|----------|
| Add details?: string[] now | Include in Phase 9, Phase 11 renders | |
| Defer to Phase 11 | Add field when building component | |
| No coursework at all | Drop EDU-03 entirely | ✓ |

**User's choice:** No coursework/details field. EDU-03 dropped.

---

## Education data content

| Option | Description | Selected |
|--------|-------------|----------|
| Use defaults | degree: "Bachelor of Computer Science", institution: "Ton Duc Thang University", startDate: "2014-09", endDate: "2018-06" | ✓ |
| Adjust degree name | Different wording | |
| Adjust dates | Correct the dates | |

**User's choice:** Default values confirmed. No link or logo_url provided — optional fields omitted.

---

## Claude's Discretion

- Field ordering within `EducationEntry`
- Whether `endDate: string | null` or `endDate?: string` (follow ExperienceEntry pattern)

## Deferred Ideas

- EDU-03 coursework display — explicitly dropped by user decision
- University logo_url — can be added to YAML later, no type change needed
- University link — can be added to YAML later, no type change needed
