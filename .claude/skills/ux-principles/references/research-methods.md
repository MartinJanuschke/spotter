# Research Methods — Detailed Reference

## Method Selection Guide

| Research question | Method | When | Sample size |
|------------------|--------|------|-------------|
| Why do users behave this way? | User interviews | Discovery, early design | 5–8 per segment |
| How do users categorize content? | Card sorting (open) | Early IA design | 15–30 |
| Can users find things? | Tree testing | Validate navigation | 20–50 |
| Does design A or B work better? | A/B testing | Optimization | Statistical significance |
| What are users actually doing? | Analytics + heatmaps | Ongoing | All users |
| Can users complete tasks? | Usability testing | Any prototype/product | 5–8 per round |
| Overall satisfaction? | SUS / NPS / CSAT survey | Post-launch, post-session | 20+ |

---

## User Interviews

**Purpose:** Deep understanding of user needs, goals, behaviors, and pain points.

### Preparation
- Define 3–5 clear research objectives before writing questions
- Create a discussion guide (flexible prompts, not a rigid script)
- Recruit 5–8 participants per user segment
- Schedule 45–60 minutes per session (30 min interview + buffer)
- Choose setting carefully: user's natural environment reveals context

### Discussion Guide Structure
1. **Warm-up** (5 min) — easy background questions to build rapport
2. **Context** (10 min) — their role, how they currently handle the problem area
3. **Core questions** (20–25 min) — the real research territory
4. **Concept/prototype reaction** (5–10 min) — optional, if testing something
5. **Wrap-up** (5 min) — "Is there anything I haven't asked that you think is important?"

### Question Types

| Type | Example | Why |
|------|---------|-----|
| **Background** | "Tell me about your role..." | Establishes context |
| **Behavior (past)** | "Walk me through the last time you [task]..." | Real behavior, not hypothetical |
| **Pain points** | "What's frustrating about the current process?" | Surfaces unmet needs |
| **Goals** | "What are you trying to accomplish when you do X?" | Reveals motivation |
| **Workarounds** | "How do you handle it when X breaks down?" | Reveals real-world coping |

### Good vs. Bad Questions

| ✅ Good | ❌ Bad |
|---------|-------|
| "Walk me through the last time you did X." | "Don't you think feature Y would be useful?" (leading) |
| "What was the hardest part of that experience?" | "Would you use a product that does X?" (hypothetical) |
| "What did you try before finding this solution?" | "Do you like this design?" (opinion, not behavior) |
| "Can you show me how you do that?" | "How often do you use this?" without probing why |

### During the Interview
- Listen 80%, talk 20%
- Use "5 Whys" to dig below surface answers
- Stay silent after asking — let the participant fill the space
- Avoid nodding or verbal agreements that validate answers
- Follow unexpected threads; they often contain the most insight

### Analysis
1. Debrief within 24 hours while memory is fresh
2. Extract key observations as individual data points (one sticky per insight)
3. Cluster observations into themes using affinity mapping
4. Identify patterns across multiple participants (n≥3 to call it a pattern)
5. Prioritize insights by frequency × impact
6. Create actionable recommendations tied to specific findings

---

## Surveys and Questionnaires

**Purpose:** Gather quantitative data from larger samples to measure attitudes, behaviors, and preferences.

### Design Principles

**Question design:**
- Use clear, unambiguous language; test with 2–3 people first
- Avoid double-barreled questions ("Was the process fast and easy?" → split into two)
- Use balanced scales (Likert: 1–5 or 1–7; not 1–10 for attitude scales)
- Include "prefer not to answer" for sensitive questions
- Randomize answer order for questions where order could bias results

**Survey structure:**
- Start with easy, engaging questions
- Group related questions together
- Place demographics at the end (low motivation, high privacy sensitivity)
- Show a progress indicator for surveys >5 minutes
- Keep as short as possible: every extra question reduces completion rate

**Question types:**
- Multiple choice (single select) — for mutually exclusive options
- Checkboxes (multiple select) — for "all that apply"
- Rating scales — for satisfaction, agreement, likelihood
- Open-ended — for qualitative color and unexpected insights
- Ranking — for priority ordering across options

---

## Usability Testing

**Purpose:** Observe real users attempting tasks to identify where designs fail.

### Types

| Type | When to use | Pros | Cons |
|------|-------------|------|------|
| **Moderated (in-person)** | Early concepts, complex flows | Rich insight, can probe | Time-intensive, interviewer effect |
| **Moderated (remote)** | Broad geographic reach | Natural environment, scalable | Less observation |
| **Unmoderated (remote)** | Later-stage validation | Fast, cost-effective | Less context |

### Process

**Planning:**
- Define 3–5 clear research questions
- Write task scenarios (realistic, not feature-based)
- Task example: "You need to add a new product to your bazaar. Please do that." NOT "Click the Add Product button."
- Recruit 5–8 participants per iteration (beyond 5, new issues found drops rapidly)
- Prepare prototype or product in a stable, testable state

**Running sessions:**
1. Welcome, explain the process ("We're testing the design, not you")
2. Obtain consent and recording permission
3. Ask 2–3 pre-test background questions
4. Give tasks one at a time (don't reveal the next task)
5. Encourage thinking aloud ("Tell me what you're thinking")
6. Observe without helping — resist the urge to guide (unless they're completely stuck for >2 min)
7. Note where hesitation, confusion, errors, or backtracking occur
8. Ask follow-up questions after each task: "What did you expect to happen there?"
9. Debrief: "Was anything surprising or confusing?"

**Analysis:**
- Watch recordings or review notes within 48 hours
- Note patterns across participants (seen by ≥3 = pattern)
- Categorize by severity (1–4 scale from ux-heuristics skill)
- Document with video clips for stakeholder reports
- Calculate task success rate and time on task

### Severity Ratings (align with ux-heuristics)
- **4 (Catastrophic):** Prevents task completion — fix immediately
- **3 (Major):** Significant struggle or failure — fix before launch
- **2 (Minor):** Causes frustration/delay — schedule fix
- **1 (Cosmetic):** Minor annoyance — fix if time allows

---

## A/B Testing

**Purpose:** Compare two versions to determine which performs better on defined metrics.

### Best Practices

**Hypothesis formation:**
- Clear, testable hypothesis: "Adding social proof above the CTA will increase conversion by X%"
- Based on research data or analytics insight, not a hunch
- Specific, measurable outcome defined upfront

**Test design:**
- Change one variable at a time (otherwise you can't attribute results)
- Ensure random assignment to variants (not time-based or geographic splits)
- Calculate required sample size before starting (use a significance calculator)
- Define success metrics before you start (prevents cherry-picking)
- Set minimum detectable effect (MDE) — what improvement would be worth shipping?

**Statistical rigor:**
- Use p-value < 0.05 as minimum threshold
- Don't stop the test early when you see promising results (peeking problem)
- Consider practical significance, not just statistical: a 0.1% lift may be statistically significant but not worth shipping
- Account for novelty effects — users respond to "new" things temporarily

**Common pitfalls:**
- Testing too many variants simultaneously
- Ignoring external factors (seasonality, marketing campaigns running)
- Not segmenting results (new vs. returning users may respond differently)
- Testing based on opinion rather than a research-backed hypothesis

---

## Card Sorting

**Purpose:** Understand how users mentally organize and categorize information.

### Types

| Type | When | What it reveals |
|------|------|-----------------|
| **Open** | Early IA design | User mental models, unexpected groupings |
| **Closed** | Validate existing structure | How well current categories work |
| **Hybrid** | Both discovery + validation | Balance of structure and flexibility |

### Process
1. Create 30–60 cards representing your content items
2. Use clear, representative labels (test that participants understand them)
3. Recruit 15–30 participants (diminishing returns after 30)
4. Tools: OptimalSort (online), Miro (in-person/remote), physical cards
5. Allow participants to work independently
6. Encourage thinking aloud during sessions

**Analysis outputs:**
- Similarity matrix — how often items are grouped together
- Dendrogram — hierarchical clustering of similar groupings
- Popular category names — what labels users naturally create
- Agreement score — consistency across participants

**Apply findings to:**
- Create/revise site map or navigation structure
- Validate or rename navigation labels
- Inform content grouping on dashboard/home screens

---

## Tree Testing

**Purpose:** Validate whether users can find content in a proposed navigation structure.

### Process
1. Build a text-only hierarchy (no visual design — isolates IA from visual noise)
2. Define 5–10 task scenarios: "Where would you go to [task]?"
3. Recruit 20–50 participants (more tasks = smaller sample per task is OK)
4. Tools: Treejack, UserZoom
5. Participants click through the tree to find each item

**Key metrics:**
- **Success rate** — % who found the correct destination
- **Directness** — % who took a direct path (no backtracking)
- **Time to completion** — how long each task takes
- **First click** — where users start (reveals initial mental model)

**Targets:**
- ≥70% success rate per task = acceptable
- <50% = significant navigation problem

**Iteration:** Revise structure, test again until targets are met. Usually 2–3 rounds.

---

## Personas

**Must include:**
- Name + photo (makes the persona memorable and human)
- Goals — functional ("complete invoice quickly") and emotional ("feel in control")
- Pain points — current frustrations and unmet needs
- Behaviors — how they currently solve the problem
- Context — when, where, and why they use the product
- Quote — representative statement capturing their mindset

**Creation process:**
1. Conduct user interviews (minimum 5–8 per segment)
2. Identify patterns in goals, behaviors, and pain points
3. Cluster users into 3–5 distinct groups
4. Draft persona profiles based on observed data patterns
5. Validate with additional research or stakeholder input
6. Share widely; refer to personas by name in design reviews

**Quality check:**
- ✅ Based on real research data
- ✅ Describes behaviors and goals (not just demographics)
- ✅ 3–5 personas max (more = impossible to design for)
- ❌ Not aspirational ("who we wish our users were")
- ❌ Not demographic-only ("35-year-old male, middle income")

---

## Journey Mapping

**Components:**
1. **Stages** — phases of the experience (e.g., Discover → Evaluate → Purchase → Use → Support)
2. **Actions** — what the user does at each stage
3. **Touchpoints** — where they interact (app, email, phone, in-person)
4. **Thoughts & feelings** — emotional state and expectations at each stage
5. **Pain points** — where friction, confusion, or failure occurs
6. **Opportunities** — where experience could be improved or delighted

**Creation process:**
1. Define scope: which journey, which persona
2. Gather data: user interviews, analytics, support tickets, session recordings
3. Map stages and actions collaboratively with stakeholders
4. Add emotions and pain points from research (not assumptions)
5. Validate with 2–3 users before treating as authoritative
6. Identify and prioritize top opportunities
7. Track improvements over time
