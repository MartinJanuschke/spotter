---
name: ux-principles
description: 'Apply foundational UX principles beyond heuristics — including user psychology, Gestalt perception, Design Thinking, research methods, and UX metrics. Use this skill whenever you need to: explain why users behave a certain way, apply cognitive laws (Fitts, Hick, Miller, cognitive load), plan or evaluate user research (interviews, surveys, usability testing, A/B testing, card sorting, journey mapping), define or interpret UX metrics (SUS, NPS, CSAT, task success rate, error rate), apply Gestalt principles to layout decisions, or run a Design Thinking process. Also use when someone asks "why do users do X?", "how do I measure UX?", "how should I test this?", "what research method should I use?", or "how do I structure a persona or journey map?". Complements ux-heuristics (which handles audits and Nielsen/Krug evaluation).'
license: MIT
metadata:
  author: wondelai
  version: "1.0.0"
---

# UX Principles Framework

Foundational principles that explain *why* users behave as they do and *how* to research, measure, and improve their experience. This skill complements `ux-heuristics` (audit + scoring) — use both together for comprehensive UX work.

## How to Apply This Skill

**Pick the right section for the task:**

- User is struggling or confused → **User Psychology** (cognitive load, mental models)
- Designing layout or visual grouping → **Gestalt Principles**
- Solving a complex problem from scratch → **Design Thinking**
- Planning or conducting research → read `references/research-methods.md`
- Measuring UX quality → read `references/ux-metrics.md`
- Need real-world application examples → read `references/ux-examples.md`

**Cite the principle by name** when making recommendations. "This violates Hick's Law — 14 options will slow decisions; cut to 5–7" is more persuasive than "simplify the menu."

---

## User-Centered Design (UCD) — Four Principles

1. **Early focus on users** — Understand users before designing. Observe them in context; map their tasks and pain points.
2. **Empirical measurement** — Test with real users doing real tasks. Collect both quantitative (completion rates, time) and qualitative (satisfaction, confusion) data.
3. **Iterative design** — Design → test → measure → redesign. Start low-fidelity. Refine based on evidence, not opinion.
4. **Integrated design** — Balance user needs, business goals, and technical constraints holistically. Involve multidisciplinary teams.

---

## Design Thinking — Five Stages

| Stage | Question | Output |
|-------|----------|--------|
| **Empathize** | Who are our users and what do they need? | Research notes, observations |
| **Define** | What problem are we solving? | Problem statement ("HMW…") |
| **Ideate** | What are all the possible solutions? | Sketches, concepts |
| **Prototype** | How might this solution work? | Low/mid-fi prototype |
| **Test** | Does it solve the problem? | Findings, next iteration |

Key principle: show don't tell — use prototypes to make ideas concrete before asking for decisions.

---

## User Psychology

### Cognitive Load
Mental effort required to use an interface. Three types:
- **Intrinsic** — inherent task complexity (can't eliminate, only manage — break into steps)
- **Extraneous** — caused by poor design (confusing layout, unclear labels → eliminate this)
- **Germane** — effort to learn patterns (beneficial — invest in onboarding)

**Reduction strategies:** chunking, recognition over recall, progressive disclosure, sensible defaults, visual hierarchy, familiar patterns, clear labels, minimize choices.

### Mental Models
Users' internal representation of how something works. Good UX aligns with existing mental models — or explicitly teaches new ones with familiar metaphors as bridges. Mismatches cause confusion and errors.

### Affordances & Signifiers
- **Affordance** — what action an element allows (a button affords clicking)
- **Signifier** — the visual cue that communicates the affordance (shadow, border, hover cursor)

Make interactive elements look interactive. Never make non-interactive elements look clickable. Test with users to validate perceived affordances.

---

## Cognitive Laws

### Fitts's Law
**Time to click a target ∝ distance / size.** Larger and closer = faster.

Applications:
- Minimum touch target: 44×44px (Apple) / 48×48px (Android)
- Primary actions get larger buttons
- Screen edges are easy targets (infinite effective width) — use for nav bars
- Context menus appear at cursor (zero travel distance)

### Hick's Law
**Decision time increases with number of choices.** More options = slower choices.

Applications:
- Cap primary nav at 5–7 items
- Use progressive disclosure for advanced options
- Highlight recommended/default choices
- Contextual menus show only relevant options

### Miller's Law
**Working memory holds ~7 (±2) items.** Chunk information; don't require memorization.

Applications:
- Navigation: 5–9 items max before grouping
- Multi-step forms: break into labeled steps with progress indicators
- Use visual aids (icons, color codes) to reduce memory requirements

---

## Gestalt Principles in UI Design

| Principle | What users perceive | Application |
|-----------|---------------------|-------------|
| **Proximity** | Close elements = related | Group form fields; space nav categories |
| **Similarity** | Similar elements = same group | Consistent styling for related actions |
| **Continuity** | Aligned elements = connected | Align labels + inputs; create visual flow |
| **Closure** | Brain completes incomplete shapes | Implied card borders; negative space boundaries |
| **Figure/Ground** | Elements = foreground OR background | Blur backgrounds for modal focus; use contrast for hierarchy |

---

## UX Metrics — Quick Reference

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Task Success Rate** | % of tasks completed | ≥78% acceptable, ≥90% excellent |
| **Time on Task** | How long to complete a task | Compare to baseline; faster = better for efficiency tasks |
| **SUS** (System Usability Scale) | Overall usability, 10-question survey, 0–100 | ≥80 excellent, ≥68 good, <51 poor |
| **NPS** | Loyalty / likelihood to recommend, -100 to +100 | ≥50 excellent, ≥0 good |
| **CSAT** | Satisfaction with specific interaction, % selecting 4–5/5 | Track trend, not absolute |
| **Error Rate** | Frequency of user errors per task | Track by type; high rate = design problem |

> For full scoring formulas and interpretation → `references/ux-metrics.md`

---

## Research Method Selection

| Question type | Method | Sample size |
|---------------|--------|-------------|
| Why do users behave this way? | User interviews | 5–8 per segment |
| How do users categorize content? | Card sorting | 15–30 |
| Can users find things in our navigation? | Tree testing | 20–50 |
| Which version performs better? | A/B testing | Statistical significance required |
| What are users doing at scale? | Analytics + heatmaps | All users |
| How well does the design work? | Usability testing | 5–8 per round |
| What do users think overall? | Survey (SUS/NPS/CSAT) | 20+ for reliability |

> For detailed protocols → `references/research-methods.md`

---

## Personas & Journey Maps — Essentials

**Persona must include:** name + photo, goals (functional + emotional), pain points, behaviors, context of use, representative quote. Base on research — never assumptions.

**Journey map must include:** stages, user actions at each stage, touchpoints, emotions/thoughts, pain points, opportunities. Start from research data (interviews, support tickets, analytics).

> Full templates and examples → `references/research-methods.md`

---

## Reference Files

- [`references/user-psychology.md`](references/user-psychology.md) — Detailed cognitive laws, mental models, affordances with examples
- [`references/ux-metrics.md`](references/ux-metrics.md) — SUS scoring, NPS calculation, CSAT, engagement metrics, benchmarks
- [`references/research-methods.md`](references/research-methods.md) — Interview guides, survey design, usability testing protocol, card sorting, tree testing, A/B testing, journey mapping
- [`references/ux-examples.md`](references/ux-examples.md) — 15 real-world examples (TurboTax, Slack, Gmail, Airbnb, Duolingo, etc.)
