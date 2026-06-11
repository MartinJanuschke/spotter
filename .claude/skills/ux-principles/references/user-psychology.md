# User Psychology — Detailed Reference

## Cognitive Load

Mental effort required to use an interface. Three types:

### Intrinsic Load
Inherent complexity of the task. Cannot be eliminated, only managed.
- Break complex tasks into smaller, labeled steps
- Provide scaffolding, defaults, and contextual guidance

### Extraneous Load
Unnecessary mental effort caused by poor design. Can and should be eliminated.
- Caused by: confusing layouts, unclear labels, inconsistency, missing feedback
- Reduce through good UX practices (clear labeling, consistent patterns, visual hierarchy)

### Germane Load
Effort required to learn and internalize patterns. Beneficial.
- Supports skill development and mastery
- Invest in onboarding and progressive learning experiences

### Strategies to Reduce Cognitive Load

| Strategy | Description | Example |
|----------|-------------|---------|
| **Chunking** | Group related information | Phone: 123-456-7890 not 1234567890 |
| **Recognition over Recall** | Show options instead of requiring memory | Dropdown vs. free-text field |
| **Progressive Disclosure** | Reveal complexity gradually | "Advanced options" collapsed by default |
| **Defaults** | Provide sensible pre-selections | Pre-fill country from IP |
| **Visual Hierarchy** | Guide attention to important elements | Primary CTA larger and higher contrast |
| **Familiar Patterns** | Use known conventions | Shopping cart, hamburger menu |
| **Clear Labels** | Descriptive, unambiguous text | "Email address" not "Contact" |
| **Minimize Choices** | Apply Hick's Law | 5 options not 15 |

---

## Mental Models

A mental model is a user's internal representation of how something works.

### Key Properties
- Formed through prior experience and learning
- May not match actual system implementation
- Vary across different user groups
- Influence expectations and predictions
- Drive user behavior and decisions

### Designing for Mental Models

**Research user expectations:**
- Conduct user interviews: "What do you expect to happen when you click X?"
- Observe task completion attempts without guidance
- Ask users to predict outcomes before acting
- Map user workflows to understand their frame

**Match or teach:**
- Align design with existing mental models when possible
- When innovation is required, use familiar metaphors as bridges
- Provide clear conceptual models for new paradigms
- Explicitly teach new mental models during onboarding

**Common mental model mismatches:**
- File systems vs. search-based organization (Google Drive confusion)
- Hierarchical nav vs. networked information (Wikipedia-style)
- Linear processes vs. flexible workflows (form wizards vs. free-form editors)
- Technical accuracy vs. user understanding (database terms in UI)

---

## Affordances and Signifiers

**Affordance:** A property of an object that shows what actions can be performed with it.
- Perceived affordances matter more than actual affordances in UI
- Buttons afford clicking through their appearance
- Text fields afford typing through cursor changes and visual shape
- Sliders afford dragging through visible handles

**Signifier:** A cue that communicates where action should take place.
- Underlines on links (signify clickability)
- Pointer cursor change (signify interaction)
- Button shading and borders (signify pressability)
- Drag handles (signify movability)

**Design implications:**
- Make interactive elements look interactive (elevation, color, cursor)
- Provide visual feedback on hover and focus
- Use consistent signifiers throughout the interface
- Never make non-interactive elements look clickable (underlined non-link text)
- Test with users to validate perceived affordances

---

## Fitts's Law

**Principle:** The time to acquire a target is a function of the distance to and size of the target.

**Formula:** T = a + b × log₂(D/W + 1)
- T = time to move to target
- D = distance to target
- W = width (size) of target

### UI Applications

**Large targets — make clickable elements bigger:**
- Minimum touch target: 44×44px (Apple HIG), 48×48px (Material Design)
- Larger buttons for primary actions (CTA > secondary action > tertiary)
- Expand hover/active areas beyond visible boundaries with invisible padding

**Proximity — place related items close together:**
- Position tooltips near their triggers
- Keep form labels adjacent to inputs (not across the screen)
- Group related actions in toolbars; don't scatter them

**Screen edges — infinite effective width:**
- macOS menu bar at top exploits this
- Windows start button at bottom corner
- Mobile bottom navigation bar
- Floating action buttons in corners

**Context menus — appear at cursor (zero travel):**
- Right-click / long-press patterns
- Faster than reaching for menu bar
- Use for actions on selected items

---

## Hick's Law

**Principle:** The time to make a decision increases logarithmically with the number of choices.

**Formula:** T = b × log₂(n + 1)

### UI Applications

**Reduce options — show only necessary choices:**
- Progressive disclosure for advanced options
- Smart defaults to pre-select common choices
- Remove rarely used features from primary UI

**Categorize — group options into logical buckets:**
- Mega menus with organized sections
- Filters and facets for narrowing large sets
- Stepped navigation (breadth vs. depth trade-off)

**Prioritize — highlight recommended options:**
- "Most popular" or "Recommended" indicators
- Default selections for common use cases
- Visually distinguish primary from secondary actions

**Context — show relevant options for current task:**
- Contextual menus based on what's selected
- Adaptive interfaces based on user history
- Role-based views that hide irrelevant actions

---

## Miller's Law

**Principle:** The average person can hold 7 (±2) items in working memory at once.

### UI Applications

**Chunk information — group content into 5–9 items:**
- Navigation menus: 5–7 items before grouping or collapsing
- Dashboard widgets: prioritize, don't show everything
- List items: use pagination or lazy loading for long lists

**Break down complex tasks:**
- Multi-step forms with step indicators ("Step 2 of 4")
- Wizards for complex configurations (one decision per screen)
- Onboarding flows with clearly bounded stages

**Use visual aids to reduce memory requirements:**
- Icons alongside text labels (recognition over recall)
- Color coding for categories
- Visual grouping of related items via proximity/borders

**Provide references — make information available:**
- Tooltips for additional context
- Inline help and examples
- Summary views of previously entered data in multi-step flows

---

## Gestalt Principles — Detailed

### Proximity
Elements close together are perceived as related.
- Group related form fields (personal info, payment info as separate groups)
- Space navigation categories apart
- Cluster related content blocks with shared background

### Similarity
Similar elements are perceived as part of a group.
- Use consistent styling for all primary buttons
- Match colors to functionality (all destructive actions = red)
- Apply uniform shapes to items of the same category

### Continuity
Elements arranged on a line or curve are perceived as related.
- Align form labels and inputs on a consistent vertical axis
- Create visual flow with layout grids
- Use lines or dividers to connect related items

### Closure
Humans mentally complete incomplete shapes.
- Subtle borders or backgrounds define card boundaries
- Implied containers through negative space
- Partially visible content signals there's more (carousel edge peeking)

### Figure/Ground
Elements are perceived as either foreground (figure) or background (ground).
- Use high contrast to emphasize primary content
- Blur or dim backgrounds when modals are open (focus on figure)
- Layer elements with shadow/depth to establish hierarchy
