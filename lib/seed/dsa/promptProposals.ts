import type { PromptProposal } from "../../types";

export const DSA_PROMPT_PROPOSALS: PromptProposal[] = [
  {
    id: "proposal-gen-v4",
    basePromptId: "prompt-generation-v3",
    proposedBody: `You are authoring a Data Structures and Algorithms (DSA) assignment for an engineering learning platform.

[UPDATED v4 — adds explicit scenario diversity requirement]

INPUTS:
- Class context: {{class_context_summary}}
- Concepts taught with depth: {{taught_concepts_with_depth}}
- Target concepts (primary, MUST be tested): {{primary_concepts}}
- Target concepts (secondary, nice to have): {{secondary_concepts}}
- Must NOT require: {{must_not_require_concepts}}
- Difficulty: tier={{tier}}, expected_solve_time={{minutes}}min
- Real-world domain (optional): {{domain}}
- Reference corpus questions (for inspiration only): {{corpus_excerpts}}
- Avoid overused scenarios: {{avoid_overused}}
- Recently generated scenarios (avoid repeating): {{recent_scenario_digests}}

[NEW CONSTRAINT #8]: The scenario must be distinct from the last 5 generated scenarios in the same category. Include a scenario_diversity_check field in reasoningTrace explaining how this scenario differs.

[MODIFIED CONSTRAINT #4]: The problem statement must NOT paraphrase any corpus excerpt AND must not resemble any recent_scenario_digest above 0.6 cosine similarity.

Output the same JSON shape as v3, with one additional field in reasoningTrace: "scenario_diversity_check": string.`,
    proposingAgent: "auto_iterator",
    reasoning: "Batch eval run 2026-02-09 detected scenario clustering: 4 of the last 8 generated assignments used observability/monitoring framing. Adding recent-scenario diversity constraint and explicit diversity check in reasoning trace should reduce this. Gold-set comparison shows this variant improves novelty scores by +0.4 median across the test set.",
    goldSetComparison: [
      { dimension: "problem_clarity", oldMedian: 4.2, newMedian: 4.2 },
      { dimension: "test_case_coverage", oldMedian: 4.0, newMedian: 4.1 },
      { dimension: "complexity_correctness", oldMedian: 4.3, newMedian: 4.3 },
      { dimension: "concept_rubric_alignment", oldMedian: 4.1, newMedian: 4.2 },
      { dimension: "real_world_fidelity", oldMedian: 3.8, newMedian: 3.9 },
      { dimension: "novelty", oldMedian: 3.4, newMedian: 3.8 }
    ],
    status: "pending"
  },
  {
    id: "proposal-judge-align-v2",
    basePromptId: "prompt-judge-alignment-v1",
    proposedBody: `You are evaluating a generated DSA assignment on ONE specific dimension: Concept-Rubric Alignment.

[UPDATED v2 — adds minimum-dimension count enforcement]

DEFINITION:
Does the rubric actually grade the concepts the problem requires the learner to apply? Does each rubric dimension correspond to evidence the learner's submission would surface?

SCORING ANCHORS:
- Score 5: Every primary concept has at least one corresponding rubric dimension grading correct application. Anchors describe observable, concrete evidence. No dimension grades something the problem doesn't require. There are at least as many dimensions as primary concepts.
- Score 3: Most concepts have rubric coverage but at least one primary concept is missing OR one dimension grades something tangential OR there are fewer dimensions than primary concepts.
- Score 1: Rubric and problem are misaligned: dimensions grade different concepts than required, or anchors are vague platitudes with no observable evidence.

[NEW] Also check: Are the rubric weights reasonable? A single dimension with weight 1.0 is automatically a Score 2 unless there is literally one thing to assess.

GOLD SET EXAMPLES (for calibration):
{{gold_set_examples_with_scores}}

ASSIGNMENT TO EVALUATE:
{{assignment_json}}

Return ONLY a JSON object:
{ "score": <integer 1-5>, "reasoning": "<2-3 sentences citing specific evidence from the assignment>" }`,
    proposingAgent: "auto_iterator",
    reasoning: "Analysis of 12 assignments that received low concept_rubric_alignment scores revealed a common failure mode: single-dimension rubrics with weight 1.0, and rubrics with fewer dimensions than primary concepts. The v2 anchor explicitly penalizes these. Gold-set comparison shows +0.6 median improvement on 3 borderline assignments that were being scored 3 when they should have been 2.",
    goldSetComparison: [
      { dimension: "problem_clarity", oldMedian: 4.2, newMedian: 4.2 },
      { dimension: "test_case_coverage", oldMedian: 4.0, newMedian: 4.0 },
      { dimension: "complexity_correctness", oldMedian: 4.3, newMedian: 4.3 },
      { dimension: "concept_rubric_alignment", oldMedian: 3.6, newMedian: 4.1 },
      { dimension: "real_world_fidelity", oldMedian: 3.8, newMedian: 3.8 },
      { dimension: "novelty", oldMedian: 3.4, newMedian: 3.4 }
    ],
    status: "pending"
  }
];
