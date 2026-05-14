# PRD — Assignment Authoring Pipeline (Front-End Prototype, DSA-focused)

## Document A of 2
This document specifies a **fully clickable front-end prototype** with no real backend. All data is mocked. All LLM calls return canned responses. The agent building from this PRD should produce a Next.js app that demonstrates every screen, flow, and state in the authoring system, populated with realistic DSA-category data.

Document B (separate file) specifies the end-to-end working system that wires this UI to a real backend with real LLM calls and code execution.

---

## 1. Purpose

Build a clickable prototype of a multi-category Assignment Authoring Pipeline used by Scaler instructors and admins. The system generates new assignments for a learning category (HLD, DSA, LLD, etc.) by combining (a) class teaching context, (b) interview question corpus, (c) target concepts, and (d) difficulty target — and runs the output through a multi-layer evaluation before instructor approval.

**Prototype scope is DSA only.** The system must be architected so HLD/LLD are clearly pluggable later, but only DSA needs full seed data.

---

## 2. Tech stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context for app-wide state; React Query for data fetching even though sources are mocked (so the swap to real APIs in Document B is trivial)
- **Code display**: Monaco Editor (read-only mode for displaying generated code)
- **Charts**: Recharts (for eval score visualizations)
- **Mock LLM**: Local async functions that return canned responses with a 1–3 second simulated delay
- **Persistence**: localStorage for any user-created data within the prototype (gold set entries the user adds, etc.)
- **No auth in prototype**; assume a single "instructor" user

---

## 3. Information architecture

```
/                                  Dashboard
/categories                        Categories list
/categories/dsa                    DSA category home
/categories/dsa/taxonomy           Concept taxonomy management
/categories/dsa/corpus             Interview question corpus
/categories/dsa/class-context      Class context library
/categories/dsa/class-context/new  Upload class script + concept extraction flow
/categories/dsa/gold-set           Gold set list
/categories/dsa/gold-set/new       Author new gold set entry
/categories/dsa/gold-set/[id]      View / edit gold set entry
/categories/dsa/generate           Generate new assignment (main workflow)
/categories/dsa/assignments        Assignment library
/categories/dsa/assignments/[id]   Assignment detail (with eval trace)
/categories/dsa/prompts            Prompt management & version history
/categories/dsa/prompts/proposals  Pending prompt change proposals
/categories/dsa/evals              Eval Judge surface (run single + batch)
/audit                             Cross-cutting version & audit log
```

A persistent left sidebar shows category navigation. Header has user name and a category switcher.

---

## 4. Data shapes

All types are TypeScript. Treat these as the source of truth for the data model; Document B reuses them.

```ts
// ---------- Category & taxonomy ----------

type CategoryId = "dsa" | "hld" | "lld";

interface Category {
  id: CategoryId;
  name: string;
  verificationLayer: "code_execution" | "llm_judge_only" | "hybrid";
  defaultDifficultyTiers: string[];   // e.g., ["easy", "medium", "hard"]
  createdAt: string;
}

interface Concept {
  id: string;                          // stable slug, e.g., "two_pointers"
  categoryId: CategoryId;
  canonicalName: string;               // "Two Pointers"
  aliases: string[];                   // ["two pointer technique", "left-right pointers"]
  definition: string;                  // 1–2 sentences
  parentId: string | null;             // for hierarchy
  depthCriteria: {
    introduced: string;                // what "introduced" means for this concept
    applied: string;
    mastered: string;
  };
  status: "active" | "deprecated";
  taxonomyVersion: number;
}

interface ConceptProposal {
  id: string;
  proposedBy: string;
  categoryId: CategoryId;
  proposed: Partial<Concept>;
  rationale: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

// ---------- Interview corpus ----------

interface InterviewQuestion {
  id: string;
  categoryId: CategoryId;
  title: string;
  body: string;
  source: string;                      // "Amazon 2024", "Internal repo", etc.
  taggedConcepts: string[];            // concept ids
  difficulty: "easy" | "medium" | "hard";
  addedAt: string;
}

// ---------- Class context ----------

interface ClassContext {
  id: string;
  categoryId: CategoryId;
  moduleId: string;                    // "dsa_module_07"
  title: string;                       // "Hash Maps and Frequency Counting"
  uploadedFiles: { name: string; uri: string }[];
  extractedConcepts: {
    conceptId: string;
    depth: "introduced" | "applied" | "mastered";
    confidence: number;                // 0–1, from LLM extraction
    confirmedByInstructor: boolean;
  }[];
  createdAt: string;
}

// ---------- Gold set ----------

interface GoldSetEntry {
  id: string;
  categoryId: CategoryId;
  input: AssignmentRequest;            // the input this gold entry corresponds to
  output: GeneratedAssignment;         // the human-authored ideal
  authoredBy: string;
  authoredAt: string;
  status: "canonical" | "candidate" | "deprecated";
  taxonomyVersion: number;
  humanRatings: {                      // optional, for calibration
    rater: string;
    perDimension: Record<string, number>;
    overallComment?: string;
  }[];
}

// ---------- Assignment request & output ----------

interface AssignmentRequest {
  categoryId: CategoryId;
  classContextId: string;
  targetConcepts: {
    primary: string[];
    secondary: string[];
    mustNotRequire: string[];
  };
  difficultyTarget: {
    tier: "easy" | "medium" | "hard";
    expectedSolveTimeMinutes: number;
    expectedConceptCount: number;
    constraintComplexity: "few" | "moderate" | "many";
  };
  assignmentType: "open_design" | "constrained_tradeoff" | "debugging" | "extension" | "coding_problem";
  realWorldAnchor?: {
    domain: string;
    avoidOverused: string[];
  };
  corpusSliceIds: string[];            // which corpus questions are in scope
}

interface GeneratedAssignment {
  id: string;
  request: AssignmentRequest;
  // DSA-specific structured fields:
  problem: {
    title: string;
    statement: string;                 // markdown
    inputFormat: string;
    outputFormat: string;
    constraints: string[];
    examples: { input: string; output: string; explanation?: string }[];
  };
  starterCode: { language: string; code: string }[];
  referenceSolution: { language: string; code: string; complexityTime: string; complexitySpace: string };
  bruteForceSolution?: { language: string; code: string };
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    rationale: string;                 // what edge case this targets
  }[];
  rubric: AssignmentRubric;
  metadata: AssignmentMetadata;
  reasoningTrace: {
    conceptSelectionRationale: string;
    scenarioSelectionRationale: string;
    difficultyCalibrationRationale: string;
    deviationsFromCorpus: string;
  };
  versions: {
    pipelineVersion: string;
    promptVersion: string;
    judgeVersion: string;
    taxonomyVersion: number;
    goldSetVersion: number;
  };
  createdAt: string;
}

interface AssignmentRubric {
  evaluationDimensions: {
    dimension: string;
    weight: number;
    anchors: { 1: string; 3: string; 5: string };
    evidenceRequired: string;
  }[];
  conceptsBeingAssessed: string[];
  redFlags: string[];
}

interface AssignmentMetadata {
  conceptsRequired: string[];
  conceptsOptional: string[];
  estimatedDifficultyScore: number;    // 0–1
  estimatedSolveTimeMinutes: number;
  realWorldDomain?: string;
  noveltyHash: string;
  sourceInspirations: { corpusId: string; similarity: number }[];
}

// ---------- Verification & eval ----------

interface VerificationRun {
  id: string;
  assignmentId: string;
  hardChecks: {
    schemaValid: boolean;
    conceptCoverage: { passed: boolean; missing: string[] };
    conceptContainment: { passed: boolean; outOfScope: string[] };
    conceptExclusion: { passed: boolean; violated: string[] };
    difficultyInBand: { passed: boolean; details: string };
    leakage: { passed: boolean; maxSimilarity: number; closestCorpusId?: string };
    // DSA-specific:
    codeExecution?: {
      passed: boolean;
      results: { testCaseId: string; passed: boolean; runtimeMs: number; output?: string; error?: string }[];
    };
  };
  passed: boolean;
  ranAt: string;
}

interface EvalRun {
  id: string;
  assignmentId: string;
  perDimensionScores: {
    dimension: string;
    medianScore: number;
    individualRuns: { score: number; reasoning: string }[];
  }[];
  compositeScore: number;
  passedThresholds: boolean;
  thresholdsUsed: { dimension: string; threshold: number; source: "gold_set" | "default" }[];
  ranAt: string;
}

interface RefinementIteration {
  iteration: number;
  triggeredBy: "hard_check_fail" | "soft_score_fail";
  failureSignal: string;               // structured tag like "concept_drift", "rubric_misaligned"
  outputId: string;                    // the new GeneratedAssignment.id
  scoreImprovement: number;            // delta from previous iteration
}

// ---------- Prompts ----------

interface PromptVersion {
  id: string;
  promptType: "generation" | "concept_extraction" | "eval_judge" | "difficulty_assessor";
  dimension?: string;                  // for eval_judge prompts
  categoryId: CategoryId;
  version: number;
  body: string;
  createdBy: string;
  createdAt: string;
  active: boolean;
}

interface PromptProposal {
  id: string;
  basePromptId: string;
  proposedBody: string;
  proposingAgent: "auto_iterator" | "human";
  reasoning: string;
  goldSetComparison: {
    dimension: string;
    oldMedian: number;
    newMedian: number;
  }[];
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

// ---------- Instructor review ----------

interface InstructorReview {
  id: string;
  assignmentId: string;
  reviewer: string;
  status: "approved" | "rejected" | "needs_changes";
  ratings: {                           // optional human rubric ratings
    dimension: string;
    score: number;
  }[];
  comments: string;
  reviewedAt: string;
}
```

---

## 5. Seed data — DSA category

The prototype must ship with the following fully populated seed data in `/lib/seed/dsa.ts`. The agent generating this PRD should write out all of it; abbreviated counts here for brevity.

**Taxonomy** — 28 DSA concepts. Sample entries (the agent fills the rest in the same style):

```ts
{
  id: "two_pointers",
  canonicalName: "Two Pointers",
  aliases: ["two pointer technique", "left-right pointers"],
  definition: "An algorithmic pattern using two indices traversing a data structure simultaneously, typically from opposite ends or at different speeds, to reduce time complexity from O(n²) to O(n).",
  parentId: "array_techniques",
  depthCriteria: {
    introduced: "Recognizes the pattern when shown an example",
    applied: "Can implement two-pointer solutions for variations like pair-sum, palindrome check",
    mastered: "Identifies when two-pointer is applicable in novel problems; can adapt for fast-slow pointer variants"
  }
}
```

Full concept list to include: `arrays`, `array_techniques` (parent), `two_pointers`, `sliding_window`, `prefix_sum`, `hashmaps`, `frequency_counting`, `hashmap_lookup`, `strings`, `string_manipulation`, `linked_lists`, `linked_list_traversal`, `fast_slow_pointers`, `stacks`, `monotonic_stack`, `queues`, `trees`, `tree_traversal_dfs`, `tree_traversal_bfs`, `binary_search_tree`, `graphs`, `graph_traversal_dfs`, `graph_traversal_bfs`, `topological_sort`, `heaps`, `priority_queue`, `sorting`, `binary_search`, `recursion`, `dynamic_programming_1d`, `dynamic_programming_2d`, `greedy`, `divide_and_conquer`.

**Interview corpus** — 15 questions with realistic statements (e.g., "Two Sum", "Longest Substring Without Repeating Characters", "Merge K Sorted Lists", with company tags and concept tags).

**Class contexts** — 4 entries representing different curriculum modules. One detailed example:

```
title: "Hash Maps and Frequency Counting"
moduleId: "dsa_module_07"
extractedConcepts: [
  { conceptId: "hashmaps", depth: "applied", confidence: 0.98 },
  { conceptId: "frequency_counting", depth: "applied", confidence: 0.95 },
  { conceptId: "hashmap_lookup", depth: "applied", confidence: 0.92 },
  { conceptId: "arrays", depth: "mastered", confidence: 0.99 },
  { conceptId: "two_pointers", depth: "introduced", confidence: 0.7 }
]
```

**Gold set** — 5 entries with full input + output (problem + solution + test cases + rubric). At least one targeting hashmaps + frequency counting, one targeting two pointers, one targeting sliding window, one DP, one tree traversal.

**Existing generated assignments** — 6 examples showing different end states:
1. Approved (high scores, single iteration)
2. Approved (after one refinement)
3. Awaiting instructor approval
4. Rejected by instructor
5. Failed eval (max iterations reached, abandoned)
6. Failed hard check (concept containment violation, shown in audit)

**Prompts** — full text for: generation prompt, concept extraction prompt, 6 eval judge prompts (one per dimension), difficulty assessor prompt. Include 2 prior versions of the generation prompt to demonstrate version history.

**Sample prompt proposals** — 2 pending proposals with diff + gold-set delta.

---

## 6. Page specifications

### 6.1 Dashboard (`/`)

Top-level overview. Shows:
- Card for each category (DSA highlighted, HLD/LLD greyed out as "coming soon")
- "Recent activity" feed: last 10 generations, reviews, prompt proposals
- Quick stats: total assignments approved, pending reviews, gold set size per category

### 6.2 Category home (`/categories/dsa`)

Hub for one category. Six tiles linking to: Generate, Assignments, Gold Set, Taxonomy, Corpus, Class Contexts. Below tiles: 3 mini-charts — score trend over last 30 days, concept coverage heatmap, refinement-rate trend.

### 6.3 Taxonomy management (`/categories/dsa/taxonomy`)

Two-pane layout. Left: hierarchical tree of concepts. Click a node to expand. Each leaf shows its concept's canonical name and a "applied/introduced/mastered" badge usage count across the assignment library.

Right: detail panel for selected concept showing all fields. Edit button (in-place editing). "Propose new concept" button at top opens a modal capturing canonical name, parent, aliases, definition, depth criteria, rationale.

Tab at top to switch to "Proposals" — list of pending concept proposals with approve/reject buttons.

### 6.4 Interview corpus (`/categories/dsa/corpus`)

Table view. Columns: title, source, difficulty, tagged concepts (chip list), added date. Search bar + filter by concept and difficulty. "Add question" button opens modal for manual entry. "Upload bulk" button accepts JSON/CSV (mocked: shows fake import progress).

Clicking a row opens a side panel with full problem statement.

### 6.5 Class context library (`/categories/dsa/class-context`)

List of class context entries. Click → detail view showing the extracted concepts (sortable by confidence), with checkboxes for "instructor confirmed." Edit button allows adjusting depth or removing erroneously extracted concepts.

`/categories/dsa/class-context/new` is a 3-step wizard:
1. Upload files (drag-drop, accepts .txt, .md, .pdf, .vtt — mock the file handling)
2. Concept extraction (simulated 4-second progress with streaming UI showing concepts as they "appear"). Shows extracted concepts with confidence scores.
3. Instructor confirmation: instructor reviews extracted concepts, adjusts depth, removes wrong ones, adds missed ones from the taxonomy. Save.

### 6.6 Gold set (`/categories/dsa/gold-set`)

Table view. Columns: title (from the assignment output), target concepts, difficulty, status (canonical/candidate/deprecated), authored by, last updated. Filters and search.

`/categories/dsa/gold-set/new` — long-form structured editor. Multi-step:
1. Input definition: pick class context, target concepts (multi-select from taxonomy with primary/secondary/must-not-require tabs), difficulty, assignment type
2. Output authoring: problem statement (markdown editor with live preview), constraints, examples, starter code (Monaco), reference solution (Monaco), brute force (optional), test cases (table editor with add/remove rows, marking visible/hidden)
3. Rubric: dimension editor — add evaluation dimensions, write 1/3/5 anchors, set weights, mark required evidence
4. Save as candidate or canonical

`/categories/dsa/gold-set/[id]` — read-only view of all the above with edit button.

### 6.7 Generate assignment (`/categories/dsa/generate`) — main workflow

This is the most important page. Multi-step:

**Step 1 — Input**
- Select class context (dropdown showing module title)
- Select target concepts: three multi-select pickers labeled "Primary (must be tested)", "Secondary (nice to have)", "Must not require"
- Difficulty target: tier dropdown, expected solve time (slider), expected concept count (slider), constraint complexity (radio)
- Assignment type: radio (for DSA: "coding_problem" is the default)
- Optional real-world anchor: domain dropdown + "avoid overused" multi-select (pre-populated with "two sum", "fizzbuzz", "palindrome")
- Corpus slice: multi-select with smart-default of corpus questions tagged with the same primary concepts
- "Generate" button

**Step 2 — Generation in progress**
Live progress panel showing pipeline stages with checkmarks as each completes (~6-8 seconds total for mock):
1. Drafting problem statement
2. Generating reference solution
3. Generating test cases
4. Running code execution verification
5. Generating rubric
6. Running hard constraint checks
7. Running Eval Judge across dimensions
8. Composite scoring

If any hard check fails, an inline alert appears with the failure reason and "Trigger refinement" button. Same for soft check fails below thresholds.

**Step 3 — Output review**
Three-column layout:
- Left: Assignment preview (rendered problem + examples + constraints)
- Middle: Verification & eval panel showing all hard check results (pass/fail with details), all eval scores per dimension (with judge reasoning expandable), threshold comparison
- Right: Actions panel — view reference solution, view test cases, view rubric, view reasoning trace, "approve and add to library" button, "reject and refine" button, "manual edit" button

If refinement triggered, the page shows the iteration history (attempts 1, 2, 3 with their scores) and you can compare versions.

**Step 4 — Approval**
Modal opens. Instructor adds optional comments and per-dimension ratings, clicks Approve. Assignment moves to library.

### 6.8 Assignment library (`/categories/dsa/assignments`)

Table view of all generated assignments (approved + rejected + abandoned). Filters: status, concept, difficulty, eval score range, date range. Click → detail page.

`/categories/dsa/assignments/[id]` — full view of:
- The assignment as a learner would see it (problem + examples + starter code + visible test cases)
- Hidden test cases (collapsed by default)
- Reference solution + brute force
- Rubric
- Full eval trace: all iterations, all hard checks, all judge scores with reasoning, threshold comparisons
- Version stamps (pipeline, prompts, judge, taxonomy, gold set)
- Instructor review record

### 6.9 Prompt management (`/categories/dsa/prompts`)

List of all prompts by type. Each row: type, dimension (if applicable), current version, last updated. Click → detail view with prompt body (Monaco), version history (timeline), diff viewer between any two versions.

Edit button creates a new draft version (doesn't immediately deploy). "Deploy" button activates that version.

`/categories/dsa/prompts/proposals` — auto-iterator prompt proposals. List view; click → side-by-side diff of old vs new prompt, gold-set score comparison table (per dimension: old median → new median with delta), reasoning text from the auto-iterator, approve / reject buttons.

### 6.10 Eval Judge surface (`/categories/dsa/evals`)

Two tabs:

**Single eval**: pick any assignment + select eval judge version + click Run. Shows per-dimension scores with reasoning.

**Batch eval (distribution check)**: pick a test input set + number of seeds → run. Output: aggregate dashboard with concept coverage chart, variance distribution, mode-collapse score (cluster count), comparison to last batch run.

### 6.11 Audit log (`/audit`)

Cross-cutting log. Filter by object type, action, user, date range. Each row: timestamp, actor, object, action, version delta. Click → full diff view.

---

## 7. Key user flows (mocked behavior)

The agent should ensure these flows feel real even though they're mocked:

**Flow 1 — Happy path generation**
Instructor goes to /categories/dsa/generate → picks "Hash Maps and Frequency Counting" class context → primary concepts: `hashmaps`, `frequency_counting` → difficulty medium → clicks Generate → 8-second progress simulation → output appears, all hard checks pass, all dimensions score above threshold → instructor reviews, approves → assignment appears in library.

**Flow 2 — Refinement loop**
Same as above, but the first generation fails the "rubric-question alignment" dimension (score 4, threshold 6.5). System auto-refines. Iteration 2 shows score 7.2. Instructor reviews both iterations side-by-side and approves iteration 2.

**Flow 3 — Hard check failure (concept containment)**
Generation produces an assignment that requires `dynamic_programming_2d` even though the class context only has hashmaps. Hard check fails with "concept containment: dynamic_programming_2d not in class context." Refinement triggered. Iteration 2 fixes the issue. Iteration history visible.

**Flow 4 — Code execution failure**
Generation produces an assignment with a reference solution that fails one of its own test cases. Hard check shows red on code execution panel, lists the failing test case with expected vs actual output. Refinement triggered.

**Flow 5 — Max iterations exhausted**
Same as flow 2 but every iteration scores below threshold. After 3 iterations, system stops and shows "Refinement exhausted — best score 5.8 (threshold 6.5). Manual edit or abandon."

**Flow 6 — Gold set authoring**
Instructor creates new gold set entry from scratch using the structured editor. Saves as candidate. Goes back to gold set list and promotes to canonical.

**Flow 7 — Prompt proposal review**
Notification banner shows "2 prompt proposals pending review." Instructor clicks → reviews diff and gold-set score comparison → approves one, rejects one. Approved one becomes active; old version archived but visible in history.

**Flow 8 — Taxonomy proposal**
Instructor goes to generate assignment, can't find concept they want in primary picker. Clicks "Propose new concept" inline. Concept goes to proposals queue. (For prototype: auto-approves after 5 seconds with a toast notification so the flow can continue.)

---

## 8. Visual design

Modern admin tool aesthetic. References: Linear, Notion, Vercel dashboard. Specifically:

- Neutral palette: white background, near-black text, gray-100 borders
- Single accent color: indigo-600 for primary actions, emerald-600 for success states, rose-600 for errors
- Generous whitespace, ~16px base font, ~14px in tables
- shadcn/ui components throughout — Cards, Tables, Dialogs, Tabs, Tooltips, Toasts, Drawers
- Monaco for all code display, with the dark VS Code theme even on light pages (code reads better in dark)
- Soft rounded corners (rounded-md), no heavy shadows
- Use Lucide icons consistently
- Sidebar collapsible on small screens

The prototype is desktop-first (≥1280px). Tablet okay, mobile not required.

---

## 9. Mock interaction notes

- All "generate" actions return mocked outputs from `/lib/seed/dsa.ts`. The agent should write 3 distinct generation outputs that map to flow 1, flow 2 (with two iterations), and flow 3 (with three iterations). The system picks one based on input parameters (e.g., specific concept combos map to specific seeded outputs) or rotates.
- LLM extraction in class context upload returns a hardcoded set of concepts with simulated streaming.
- Eval Judge scores are seeded per generated output.
- Code execution returns hardcoded results per generated output (pass for happy path, fail for flow 4 scenario).
- All "create" actions for user-authored objects (gold set entries, concept proposals) persist to localStorage so the user can see them stick across page navigations within the session.
- "Reset prototype data" button in dashboard footer wipes localStorage.

---

## 10. Acceptance criteria

The prototype is complete when:

1. Every page in section 3 exists and renders with realistic data
2. All 8 flows in section 7 are demonstrable end-to-end
3. The taxonomy tree shows all 28 concepts hierarchically
4. The corpus shows 15 questions
5. The gold set shows 5 entries; user can create a 6th and see it in the list
6. The assignment library shows 6 seeded assignments in different states; user can generate a 7th
7. Every assignment detail page shows the full eval trace including version stamps
8. Prompt management shows all prompts with at least one version history (one prompt with 3 versions)
9. Prompt proposals page shows 2 pending proposals with diff and gold-set delta
10. Audit log shows entries across all object types
11. All mock LLM calls have visible simulated delay (no instant returns)
12. Refinement loop UI clearly shows iteration history and side-by-side comparison
13. The "Reset prototype data" button works and reloads seed data

---

## 11. Out of scope for prototype A

- Real LLM calls
- Real code execution
- Authentication / multi-user
- HLD or LLD category data (only DSA needs seed data; sidebar should show HLD/LLD as disabled)
- File uploads beyond mock progress simulation
- Backend persistence
- Submission Judge (the system that grades learner submissions; built later)
- Learner-facing views

All of these are covered in Document B.

---

## Appendix A — Full prompt texts

These prompts must be included verbatim in `/lib/seed/dsa.ts` as `PromptVersion` records. The agent can format them as multi-line strings.

### A.1 Generation prompt (active version, v3)

```
You are authoring a Data Structures and Algorithms (DSA) assignment for an engineering learning platform.

INPUTS:
- Class context: {{class_context_summary}} — concepts taught: {{taught_concepts_with_depth}}
- Target concepts (primary, must be tested): {{primary_concepts}}
- Target concepts (secondary, nice to have): {{secondary_concepts}}
- Must NOT require: {{must_not_require_concepts}}
- Difficulty: tier={{tier}}, expected solve time={{minutes}}min, expected distinct concepts={{concept_count}}
- Real-world domain (optional): {{domain}}
- Reference corpus questions (for inspiration only, NEVER copy): {{corpus_excerpts}}
- Avoid overused scenarios: {{avoid_overused}}

OUTPUT a JSON object with the following structure (and nothing else):
{
  "problem": { "title", "statement", "inputFormat", "outputFormat", "constraints", "examples" },
  "starterCode": [{ "language", "code" }],
  "referenceSolution": { "language", "code", "complexityTime", "complexitySpace" },
  "bruteForceSolution": { "language", "code" } | null,
  "testCases": [{ "input", "expectedOutput", "visibility", "rationale" }],
  "rubric": { "evaluationDimensions": [...], "conceptsBeingAssessed": [...], "redFlags": [...] },
  "metadata": { "conceptsRequired", "conceptsOptional", "estimatedDifficultyScore", "estimatedSolveTimeMinutes", "realWorldDomain", "noveltyHash", "sourceInspirations" },
  "reasoningTrace": { "conceptSelectionRationale", "scenarioSelectionRationale", "difficultyCalibrationRationale", "deviationsFromCorpus" }
}

CONSTRAINTS:
1. Every concept in primary_concepts must appear in metadata.conceptsRequired.
2. No concept in metadata.conceptsRequired can be absent from the class_context's taught_concepts at depth ≥ introduced.
3. No concept in metadata.conceptsRequired can appear in must_not_require_concepts.
4. The problem statement must NOT be a substring or close paraphrase of any corpus excerpt.
5. The reference solution must pass all generated test cases (you will be verified by code execution).
6. Test cases must include at least 2 sample cases (visible) and 4 hidden cases. Hidden cases must cover edge cases including: empty input, single element, boundary values, worst case for complexity.
7. The rubric's evaluationDimensions must include at least one dimension per primary concept that explicitly assesses correct application of that concept.

Think carefully about edge cases. Be specific about constraints (input ranges, time/memory limits). Make the problem statement self-contained.
```

### A.2 Concept extraction prompt

```
You are extracting the concepts taught in a Data Structures and Algorithms class session.

INPUT: Class transcript / slide content: {{class_material}}
Available taxonomy: {{taxonomy_concept_list}}

For each concept in the taxonomy, determine if it was:
- "mastered" (taught extensively with worked examples and learner practice)
- "applied" (taught with at least one worked example)
- "introduced" (named and briefly defined)
- not present

Return JSON: [{ "conceptId", "depth", "confidence" (0-1), "evidence": "quoted phrase from input" }]

Only include concepts present in the input. Do not invent concepts not in the taxonomy. If a concept is referenced but not the taxonomy, note it in a separate "proposedNewConcepts" array.
```

### A.3 Eval judge prompts — one per dimension

Six dimensions, each a separate prompt with this template:

```
You are evaluating a generated DSA assignment on one specific dimension: {{dimension_name}}.

DEFINITION: {{dimension_definition}}

ANCHORS:
- Score 5: {{anchor_5}}
- Score 3: {{anchor_3}}
- Score 1: {{anchor_1}}

EXAMPLES FROM GOLD SET (for calibration):
{{gold_set_examples_with_scores}}

ASSIGNMENT TO EVALUATE:
{{assignment_json}}

Return JSON: { "score": <1-5>, "reasoning": "<2-3 sentences citing specific evidence from the assignment>" }

Do not consider any dimension other than {{dimension_name}}. Be strict but fair. Use the full range — most assignments should score 2-4; a 5 requires excellence; a 1 requires fundamental failure.
```

The six dimensions with specific anchors:
1. **Problem clarity** — Is the statement unambiguous? Are input/output formats and constraints precise?
2. **Test case coverage** — Do hidden cases adequately cover edge cases for the stated concepts?
3. **Complexity correctness** — Does the reference solution actually achieve the stated complexity? Does the brute force differ meaningfully?
4. **Concept-rubric alignment** — Does the rubric grade the concepts the problem actually requires?
5. **Real-world fidelity** — Is the scenario plausibly something an engineer would encounter, or a textbook contrivance?
6. **Novelty** — Is this distinguishable from canonical interview questions, or a thin rename?

Full anchor text for each dimension is filled in the seed file.

### A.4 Difficulty assessor prompt (independent cross-check, different model)

```
You are independently assessing the difficulty of a DSA problem. You do not know what the author claimed.

PROBLEM: {{problem_statement_and_constraints}}
REFERENCE SOLUTION: {{reference_solution}}

Rate on these axes:
- conceptual_difficulty: 1 (single basic concept) – 5 (multi-concept integration with non-obvious insight)
- implementation_difficulty: 1 (under 20 lines straightforward) – 5 (intricate code with many edge cases)
- estimated_solve_time_minutes: integer estimate for a competent learner who has been taught the relevant concepts
- distinct_concepts_required: integer count

Return JSON: { "conceptual_difficulty", "implementation_difficulty", "estimated_solve_time_minutes", "distinct_concepts_required", "reasoning" }
```

---

## Appendix B — File structure

```
/app
  /(routes per section 3)
/components
  /ui              shadcn primitives
  /domain          AssignmentCard, RubricEditor, ConceptPicker, etc.
/lib
  /seed
    dsa.ts         all seed data
    prompts.ts     prompt texts
  /mock
    llm.ts         mock LLM with delays
    execution.ts   mock code execution
  /storage
    local.ts       localStorage abstraction
  /types
    index.ts       all TS types from section 4
/hooks
  /useAssignments.ts, /useTaxonomy.ts, etc.
```

End of Document A.
