import type { PromptVersion } from "../../types";

const GENERATION_V1 = `You generate DSA assignments. Given the inputs, write a problem with examples, a solution, and 5 test cases. Output JSON.`;

const GENERATION_V2 = `You are an instructor authoring DSA assignments.

Given:
- Class context: {{class_context_summary}}
- Concepts the learner has been taught: {{taught_concepts_with_depth}}
- Target concepts: {{primary_concepts}}
- Difficulty: {{tier}}

Produce a JSON assignment with: problem statement, solution code, test cases, rubric.

Requirements:
- Don't use concepts the learner hasn't been taught.
- Test cases must include edge cases.
- The solution must be correct.
- The problem should be different from the reference corpus.

Output only the JSON.`;

const GENERATION_V3 = `You are authoring a Data Structures and Algorithms (DSA) assignment for an engineering learning platform.

INPUTS:
- Class context: {{class_context_summary}}
- Concepts taught with depth: {{taught_concepts_with_depth}}
- Target concepts (primary, MUST be tested): {{primary_concepts}}
- Target concepts (secondary, nice to have): {{secondary_concepts}}
- Must NOT require: {{must_not_require_concepts}}
- Difficulty: tier={{tier}}, expected_solve_time={{minutes}}min, expected_distinct_concepts={{concept_count}}, constraint_complexity={{constraint_complexity}}
- Real-world domain (optional): {{domain}}
- Reference corpus questions (for inspiration only, NEVER copy or close-paraphrase): {{corpus_excerpts}}
- Avoid overused scenarios: {{avoid_overused}}

You must return a single JSON object with this exact shape (no markdown fences, no commentary):
{
  "problem": {
    "title": string,
    "statement": string (markdown allowed, self-contained),
    "inputFormat": string,
    "outputFormat": string,
    "constraints": string[] (input ranges, time/memory limits),
    "examples": [{ "input": string, "output": string, "explanation": string }]
  },
  "starterCode": [{ "language": "python", "code": string }],
  "referenceSolution": { "language": "python", "code": string, "complexityTime": string, "complexitySpace": string },
  "bruteForceSolution": { "language": "python", "code": string } | null,
  "testCases": [{ "input": string, "expectedOutput": string, "visibility": "sample" | "hidden", "rationale": string }],
  "rubric": {
    "evaluationDimensions": [{
      "dimension": string,
      "weight": number (sums to 1.0),
      "anchors": { "1": string, "3": string, "5": string },
      "evidenceRequired": string
    }],
    "conceptsBeingAssessed": string[],
    "redFlags": string[]
  },
  "metadata": {
    "conceptsRequired": string[],
    "conceptsOptional": string[],
    "estimatedDifficultyScore": number (0-1),
    "estimatedSolveTimeMinutes": number,
    "realWorldDomain": string,
    "noveltyHash": string (16-char content hash for dedup),
    "sourceInspirations": [{ "corpusId": string, "similarity": number (0-1) }]
  },
  "reasoningTrace": {
    "conceptSelectionRationale": string,
    "scenarioSelectionRationale": string,
    "difficultyCalibrationRationale": string,
    "deviationsFromCorpus": string
  }
}

HARD CONSTRAINTS (your output will be rejected if violated):
1. Every concept in primary_concepts must appear in metadata.conceptsRequired.
2. No concept in metadata.conceptsRequired may be absent from taught_concepts_with_depth at depth >= "introduced".
3. No concept in metadata.conceptsRequired may appear in must_not_require_concepts.
4. The problem.statement must NOT be a substring or close paraphrase of any corpus excerpt.
5. The referenceSolution MUST pass all testCases when executed.
6. testCases must include at least 2 "sample" cases (visible) and 4 "hidden" cases.
7. rubric.evaluationDimensions must include at least one dimension per primary_concept.

Think step by step. Output only the JSON.`;

const CONCEPT_EXTRACTION_V1 = `You are extracting the concepts taught in a Data Structures and Algorithms class session.

INPUT:
- Class material (transcript, slides, or notes): {{class_material}}
- Available taxonomy (you may ONLY tag concepts that exist in this list): {{taxonomy_concept_list}}

For each concept present in the class material, determine depth:
- "mastered": taught extensively, with multiple worked examples AND learner-applied practice
- "applied": taught with at least one worked example end-to-end
- "introduced": named and briefly defined, but not worked through
- (omit if not present)

Return a JSON object:
{
  "extracted": [{ "conceptId": string, "depth": "mastered"|"applied"|"introduced", "confidence": number (0-1), "evidence": string }],
  "proposedNewConcepts": [{ "suggestedName": string, "rationale": string, "evidence": string }]
}

Rules:
- Use the exact conceptId strings from the taxonomy.
- Only include concepts with clear textual evidence in the input.
- Do not invent conceptIds; if a topic was clearly taught but doesn't exist in the taxonomy, add to proposedNewConcepts instead.
- Be conservative with confidence: 0.95+ requires explicit and unambiguous evidence.`;

function judgeTemplate(dimensionName: string, definition: string, anchors: { 1: string; 3: string; 5: string }): string {
  return `You are evaluating a generated DSA assignment on ONE specific dimension: ${dimensionName}.

DEFINITION:
${definition}

SCORING ANCHORS:
- Score 5: ${anchors[5]}
- Score 3: ${anchors[3]}
- Score 1: ${anchors[1]}

GOLD SET EXAMPLES (for calibration):
{{gold_set_examples_with_scores}}

ASSIGNMENT TO EVALUATE:
{{assignment_json}}

Return ONLY a JSON object:
{ "score": <integer 1-5>, "reasoning": "<2-3 sentences citing specific evidence from the assignment>" }

Do not consider any dimension other than ${dimensionName}. Be strict but fair. Use the full range.`;
}

const JUDGE_PROBLEM_CLARITY = judgeTemplate(
  "Problem Clarity",
  "Is the problem statement unambiguous? Are input and output formats precise? Are constraints (ranges, sizes, limits) explicit and consistent?",
  {
    5: "Statement is crystal clear, input/output formats fully specified, all constraints explicit and internally consistent. A learner reading it cannot reasonably misinterpret.",
    3: "Statement is mostly clear but at least one ambiguity exists (unspecified type, missing range, unclear edge case). A careful learner could still solve it.",
    1: "Statement is fundamentally ambiguous, contradictory, or missing critical information."
  }
);

const JUDGE_TEST_CASE_COVERAGE = judgeTemplate(
  "Test Case Coverage",
  "Do the test cases (especially hidden ones) adequately cover edge cases for the concepts being tested?",
  {
    5: "Test cases comprehensively cover empty/minimal input, single-element, boundary values, and worst-case complexity. Each case has clear rationale.",
    3: "Most edge cases covered; one important edge case is missing or weakly tested.",
    1: "Test cases cover only the happy path; critical edge cases are absent."
  }
);

const JUDGE_COMPLEXITY_CORRECTNESS = judgeTemplate(
  "Complexity Correctness",
  "Does the reference solution actually achieve the claimed time and space complexity?",
  {
    5: "Reference solution achieves the claimed complexity precisely. Brute force, if provided, is meaningfully less efficient.",
    3: "Reference solution achieves stated complexity but the claim is loose; or brute force is only marginally different.",
    1: "Reference solution does NOT achieve the claimed complexity, or claim is misleadingly stated."
  }
);

const JUDGE_CONCEPT_RUBRIC_ALIGNMENT = judgeTemplate(
  "Concept-Rubric Alignment",
  "Does the rubric actually grade the concepts the problem requires the learner to apply?",
  {
    5: "Every primary concept has at least one corresponding rubric dimension that grades correct application. Anchors describe observable evidence.",
    3: "Most concepts have rubric coverage but at least one primary concept is missing or one dimension grades something tangential.",
    1: "Rubric and problem are misaligned: the rubric grades different concepts than the problem requires."
  }
);

const JUDGE_REAL_WORLD_FIDELITY = judgeTemplate(
  "Real-World Fidelity",
  "Is the scenario plausibly something an engineer might encounter, or is it a textbook contrivance?",
  {
    5: "Scenario is recognizably real: the constraints and stakes mirror an actual engineering situation. A senior engineer would say 'yes, I have built something like this.'",
    3: "Scenario is acceptable but generic; could be from any tutorial. Real-world veneer is thin.",
    1: "Scenario is purely contrived ('given an array of integers...'). No attempt at engineering grounding."
  }
);

const JUDGE_NOVELTY = judgeTemplate(
  "Novelty",
  "Is this distinguishable from canonical interview questions (Two Sum, Valid Parens, etc.), or a thin rename?",
  {
    5: "Genuinely novel framing or twist. A learner familiar with canonical interview questions will need to think, not pattern-match.",
    3: "Recognizable canonical problem with cosmetic changes (renamed variables, different domain).",
    1: "Verbatim or near-verbatim canonical problem. A learner who has seen the canonical version answers from memory."
  }
);

const DIFFICULTY_ASSESSOR_V1 = `You are independently assessing the difficulty of a DSA problem. You do not know what the author claimed about difficulty.

PROBLEM STATEMENT AND CONSTRAINTS:
{{problem_statement_and_constraints}}

REFERENCE SOLUTION:
{{reference_solution}}

Rate the problem on these four axes:
- conceptual_difficulty (1-5): 1 = single basic concept applied directly; 5 = multi-concept integration with non-obvious insight needed
- implementation_difficulty (1-5): 1 = under 20 lines straightforward; 5 = intricate code with many edge cases
- estimated_solve_time_minutes (integer): time for a competent learner who has been taught the relevant concepts
- distinct_concepts_required (integer): count of distinct algorithmic concepts the solution requires

Return ONLY JSON:
{ "conceptual_difficulty": int, "implementation_difficulty": int, "estimated_solve_time_minutes": int, "distinct_concepts_required": int, "reasoning": "2-3 sentence justification" }`;

export const DSA_PROMPTS: PromptVersion[] = [
  {
    id: "prompt-generation-v1",
    promptType: "generation",
    categoryId: "dsa",
    version: 1,
    body: GENERATION_V1,
    createdBy: "user-admin-1",
    createdAt: "2025-11-01T10:00:00Z",
    active: false
  },
  {
    id: "prompt-generation-v2",
    promptType: "generation",
    categoryId: "dsa",
    version: 2,
    body: GENERATION_V2,
    createdBy: "user-admin-1",
    createdAt: "2025-12-15T10:00:00Z",
    active: false
  },
  {
    id: "prompt-generation-v3",
    promptType: "generation",
    categoryId: "dsa",
    version: 3,
    body: GENERATION_V3,
    createdBy: "user-admin-1",
    createdAt: "2026-01-20T10:00:00Z",
    active: true
  },
  {
    id: "prompt-extraction-v1",
    promptType: "concept_extraction",
    categoryId: "dsa",
    version: 1,
    body: CONCEPT_EXTRACTION_V1,
    createdBy: "user-admin-1",
    createdAt: "2026-01-05T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-clarity-v1",
    promptType: "eval_judge",
    dimension: "problem_clarity",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_PROBLEM_CLARITY,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-test-coverage-v1",
    promptType: "eval_judge",
    dimension: "test_case_coverage",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_TEST_CASE_COVERAGE,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-complexity-v1",
    promptType: "eval_judge",
    dimension: "complexity_correctness",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_COMPLEXITY_CORRECTNESS,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-alignment-v1",
    promptType: "eval_judge",
    dimension: "concept_rubric_alignment",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_CONCEPT_RUBRIC_ALIGNMENT,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-realworld-v1",
    promptType: "eval_judge",
    dimension: "real_world_fidelity",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_REAL_WORLD_FIDELITY,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-judge-novelty-v1",
    promptType: "eval_judge",
    dimension: "novelty",
    categoryId: "dsa",
    version: 1,
    body: JUDGE_NOVELTY,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  },
  {
    id: "prompt-difficulty-v1",
    promptType: "difficulty_assessor",
    categoryId: "dsa",
    version: 1,
    body: DIFFICULTY_ASSESSOR_V1,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  }
];
