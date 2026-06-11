# UX Metrics — Detailed Reference

## Task Success Rate

**Definition:** Percentage of tasks completed successfully.

**Measurement:**
- Binary: Did user complete task? (Yes/No) — simplest, most common
- Partial credit: 0–100% scale — for tasks with sub-goals
- Track per task and overall

**Benchmarks:**
- ≥90% — excellent
- ≥78% — acceptable
- <70% — serious usability problems; prioritize fixes

**Application:**
- Compare design versions (A vs. B)
- Track improvement over iterations
- Prioritize issues: low success rate = high fix priority
- Set improvement targets before shipping

---

## Time on Task

**Definition:** How long it takes users to complete a task.

**Measurement:**
- Start timer when task begins, stop at completion or abandonment
- Report mean AND median (outliers skew mean)
- Calculate range to spot high-variance tasks

**Interpretation:**
- Faster is better for efficiency tasks (checkout, form fill)
- Faster is NOT always better for content consumption tasks
- Compare against baseline or previous iteration, not absolute targets
- High variance → some users struggle badly; investigate why

**Use cases:**
- Identify inefficient workflows
- Compare alternative designs
- Measure expert vs. novice performance gap
- Calculate ROI of improvements (time saved × users × sessions)

---

## System Usability Scale (SUS)

**Definition:** 10-item standardized questionnaire providing a single usability score.

**The 10 questions** (5-point Likert: Strongly Disagree → Strongly Agree):
1. I think I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think I would need the support of a technical person to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

**Scoring:**
- Odd items (1,3,5,7,9): contribution = score − 1
- Even items (2,4,6,8,10): contribution = 5 − score
- Sum all 10 contributions, multiply by 2.5
- Result: 0–100 scale

**Interpretation:**
| Score | Grade | Adjective |
|-------|-------|-----------|
| ≥80.3 | A | Excellent |
| 68–80.3 | B–C | Good |
| 51–68 | D | OK |
| <51 | F | Poor |

**Notes:**
- Average SUS across products historically: ~68
- Administer immediately after use, not days later
- Minimum reliable sample: 8–10 participants; 20+ preferred

---

## Net Promoter Score (NPS)

**Definition:** Measures customer loyalty and word-of-mouth likelihood.

**Question:** "How likely are you to recommend [product] to a friend or colleague?" (0–10 scale)

**Calculation:**
- Promoters: 9–10
- Passives: 7–8
- Detractors: 0–6
- **NPS = % Promoters − % Detractors** (range: −100 to +100)

**Benchmarks:**
- ≥50 — excellent
- ≥0 — good
- <0 — needs improvement

**Limitations:**
- Doesn't explain *why* users feel this way
- Influenced by factors beyond UX (pricing, support, brand)
- Always include follow-up: "What's the main reason for your score?"

---

## Customer Satisfaction (CSAT)

**Definition:** Measures satisfaction with a specific experience or interaction.

**Question:** "How satisfied were you with [specific experience]?" (1–5 scale)

**Calculation:**
- CSAT = % of respondents selecting 4 or 5

**Timing — use after:**
- Completing a key task (checkout, onboarding)
- Contacting support
- Using a specific feature for the first time

**Use cases:**
- Compare satisfaction across features (find weakest links)
- Track improvement over iterations
- Trigger follow-up research when score drops

---

## Error Rate

**Definition:** Frequency of user errors during task completion.

**Types:**
- **Slips** — incorrect actions despite correct intention (misclick, wrong button)
- **Mistakes** — incorrect intention leading to wrong action (misunderstood label)

**Measurement:**
- Count errors per task completion attempt
- Categorize by type (slip vs. mistake)
- Track whether users recovered and how long recovery took

**Analysis:**
- High error rate → usability problem
- Same error repeated across multiple users → design issue, not user issue
- Slow recovery → error feedback is unclear
- Design priority: **Prevention > detection > recovery**

---

## Engagement Metrics

| Metric | Definition | Notes |
|--------|-----------|-------|
| **DAU/MAU** | Daily / Monthly Active Users | Absolute usage volume |
| **Stickiness** | DAU ÷ MAU | Higher = more habit-forming; target varies by product type |
| **Session Duration** | Time per visit | Context-dependent; not always "longer = better" |
| **Feature Adoption** | % of users who use a feature | Track over time; low adoption = discoverability problem |
| **Retention Rate** | % of users who return | Daily/weekly/monthly; inverse = churn rate |
| **Funnel Drop-off** | Where users abandon flows | Pinpoints friction in checkout, onboarding, etc. |

---

## Choosing the Right Metric

| If you want to know... | Use |
|------------------------|-----|
| Can users complete key tasks? | Task Success Rate |
| How efficient is the flow? | Time on Task |
| Overall perceived usability? | SUS |
| Would users recommend us? | NPS |
| Satisfaction with a specific moment? | CSAT |
| Where users make mistakes? | Error Rate |
| Is this feature being used? | Feature Adoption |
| Are users coming back? | Retention / DAU/MAU |
