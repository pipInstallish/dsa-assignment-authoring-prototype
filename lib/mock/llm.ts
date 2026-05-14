import type { GeneratedAssignment, VerificationRun, EvalRun } from "../types";
import { DSA_ASSIGNMENTS } from "../seed/dsa";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return delay(ms);
}

// Maps primary concept combos to specific flows
export function getFlowForConcepts(primaryConcepts: string[]): number {
  const key = [...primaryConcepts].sort().join(",");
  const flowMap: Record<string, number> = {
    "frequency_counting,hashmaps": 1,
    "hashmaps,frequency_counting": 1,
    "sliding_window": 2,
    "sorting,two_pointers": 3,
    "two_pointers,sorting": 3,
    "tree_traversal_dfs,trees": 4,
    "trees,tree_traversal_dfs": 4,
    "dynamic_programming_1d": 5,
  };
  return flowMap[key] || 1;
}

// Returns the appropriate seeded assignment for a given flow
export function getSeededAssignmentForFlow(flow: number): { record: typeof DSA_ASSIGNMENTS[0]; iteration?: number } {
  switch (flow) {
    case 1:
      return { record: DSA_ASSIGNMENTS[0] }; // assign-001 happy path
    case 2:
      return { record: DSA_ASSIGNMENTS[1] }; // assign-002 refinement
    case 3:
      return { record: DSA_ASSIGNMENTS[5] }; // assign-006 hard check fail
    case 4:
      // Code execution failure — we'll simulate this with a modified version of assign-003
      return { record: DSA_ASSIGNMENTS[2] };
    case 5:
      return { record: DSA_ASSIGNMENTS[4] }; // assign-005 max iterations
    default:
      return { record: DSA_ASSIGNMENTS[0] };
  }
}

export interface GenerationStage {
  stage: string;
  label: string;
  durationMs: number;
}

export const GENERATION_STAGES: GenerationStage[] = [
  { stage: "drafting_problem", label: "Drafting problem statement", durationMs: 1200 },
  { stage: "generating_solution", label: "Generating reference solution", durationMs: 1000 },
  { stage: "generating_tests", label: "Generating test cases", durationMs: 800 },
  { stage: "code_execution", label: "Running code execution verification", durationMs: 900 },
  { stage: "generating_rubric", label: "Generating rubric", durationMs: 700 },
  { stage: "hard_checks", label: "Running hard constraint checks", durationMs: 600 },
  { stage: "eval_judge", label: "Running Eval Judge across dimensions", durationMs: 1100 },
  { stage: "composite_scoring", label: "Computing composite score", durationMs: 500 },
];

export async function mockGenerateAssignment(
  primaryConcepts: string[],
  onStageComplete: (stage: string, index: number) => void
): Promise<{ assignment: GeneratedAssignment; verificationRun: VerificationRun; evalRun: EvalRun; flow: number }> {
  const flow = getFlowForConcepts(primaryConcepts);
  const { record } = getSeededAssignmentForFlow(flow);

  for (let i = 0; i < GENERATION_STAGES.length; i++) {
    const stage = GENERATION_STAGES[i];
    await delay(stage.durationMs);
    onStageComplete(stage.stage, i);
  }

  return {
    assignment: record.assignment,
    verificationRun: record.verificationRuns[0],
    evalRun: record.evalRuns[0],
    flow
  };
}

export async function mockRefineAssignment(
  assignmentId: string,
  iteration: number,
  onStageComplete: (stage: string, index: number) => void
): Promise<{ assignment: GeneratedAssignment; verificationRun: VerificationRun; evalRun: EvalRun }> {
  // Find the record for iteration 2
  const record = DSA_ASSIGNMENTS.find(r =>
    r.allIterationAssignments && r.allIterationAssignments.length > 1
  );

  for (let i = 0; i < GENERATION_STAGES.length; i++) {
    const stage = GENERATION_STAGES[i];
    await delay(stage.durationMs * 0.8);
    onStageComplete(stage.stage, i);
  }

  if (record && record.allIterationAssignments && record.allIterationAssignments[iteration]) {
    return {
      assignment: record.allIterationAssignments[iteration],
      verificationRun: record.verificationRuns[Math.min(iteration, record.verificationRuns.length - 1)],
      evalRun: record.evalRuns[Math.min(iteration, record.evalRuns.length - 1)]
    };
  }

  return {
    assignment: DSA_ASSIGNMENTS[0].assignment,
    verificationRun: DSA_ASSIGNMENTS[0].verificationRuns[0],
    evalRun: DSA_ASSIGNMENTS[0].evalRuns[0]
  };
}

export async function mockExtractConcepts(
  onConceptFound: (conceptId: string, depth: "introduced" | "applied" | "mastered", confidence: number) => void
): Promise<void> {
  const concepts = [
    { conceptId: "arrays", depth: "mastered" as const, confidence: 0.99 },
    { conceptId: "hashmaps", depth: "applied" as const, confidence: 0.97 },
    { conceptId: "hashmap_lookup", depth: "applied" as const, confidence: 0.94 },
    { conceptId: "frequency_counting", depth: "applied" as const, confidence: 0.92 },
    { conceptId: "two_pointers", depth: "introduced" as const, confidence: 0.71 },
  ];

  await delay(500);
  for (const concept of concepts) {
    await delay(600 + Math.random() * 400);
    onConceptFound(concept.conceptId, concept.depth, concept.confidence);
  }
  await delay(500);
}

export async function mockRunEvalJudge(
  assignmentId: string
): Promise<EvalRun> {
  await randomDelay(1500, 2500);
  const record = DSA_ASSIGNMENTS.find(r => r.assignment.id === assignmentId);
  if (record) {
    return record.evalRuns[record.evalRuns.length - 1];
  }
  return DSA_ASSIGNMENTS[0].evalRuns[0];
}

export async function mockApprovePromptProposal(proposalId: string): Promise<void> {
  await randomDelay(800, 1200);
}

export async function mockRejectPromptProposal(proposalId: string): Promise<void> {
  await randomDelay(500, 800);
}
