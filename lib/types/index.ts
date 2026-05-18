// ---------- Category & taxonomy ----------

export type CategoryId = "dsa" | "hld" | "lld";

export interface Category {
  id: CategoryId;
  name: string;
  verificationLayer: "code_execution" | "llm_judge_only" | "hybrid";
  defaultDifficultyTiers: string[];
  createdAt: string;
}

export interface Concept {
  id: string;
  categoryId: CategoryId;
  canonicalName: string;
  aliases: string[];
  definition: string;
  parentId: string | null;
  depthCriteria: {
    introduced: string;
    applied: string;
    mastered: string;
  };
  status: "active" | "deprecated";
  taxonomyVersion: number;
}

export interface ConceptProposal {
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

export interface InterviewQuestion {
  id: string;
  categoryId: CategoryId;
  title: string;
  body: string;
  source: string;
  taggedConcepts: string[];
  difficulty: "easy" | "medium" | "hard";
  addedAt: string;
}

// ---------- Class context ----------

export interface ClassContext {
  id: string;
  categoryId: CategoryId;
  moduleId: string;
  title: string;
  uploadedFiles: { name: string; uri: string }[];
  extractedConcepts: {
    conceptId: string;
    depth: "introduced" | "applied" | "mastered";
    confidence: number;
    confirmedByInstructor: boolean;
  }[];
  createdAt: string;
}

// ---------- Gold set ----------

export interface GoldSetEntry {
  id: string;
  categoryId: CategoryId;
  input: AssignmentRequest;
  output: GeneratedAssignment;
  authoredBy: string;
  authoredAt: string;
  status: "canonical" | "candidate" | "deprecated";
  taxonomyVersion: number;
  humanRatings: {
    rater: string;
    perDimension: Record<string, number>;
    overallComment?: string;
  }[];
}

// ---------- Assignment request & output ----------

export interface AssignmentRequest {
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
  corpusSliceIds: string[];
}

export interface GeneratedAssignment {
  id: string;
  request: AssignmentRequest;
  problem: {
    title: string;
    statement: string;
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
    rationale: string;
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

export interface AssignmentRubric {
  evaluationDimensions: {
    dimension: string;
    weight: number;
    anchors: { 1: string; 3: string; 5: string };
    evidenceRequired: string;
  }[];
  conceptsBeingAssessed: string[];
  redFlags: string[];
}

export interface AssignmentMetadata {
  conceptsRequired: string[];
  conceptsOptional: string[];
  estimatedDifficultyScore: number;
  estimatedSolveTimeMinutes: number;
  realWorldDomain?: string;
  noveltyHash: string;
  sourceInspirations: { corpusId: string; similarity: number }[];
}

// ---------- Verification & eval ----------

export interface VerificationRun {
  id: string;
  assignmentId: string;
  hardChecks: {
    schemaValid: boolean;
    conceptCoverage: { passed: boolean; missing: string[] };
    conceptContainment: { passed: boolean; outOfScope: string[] };
    conceptExclusion: { passed: boolean; violated: string[] };
    difficultyInBand: { passed: boolean; details: string };
    leakage: { passed: boolean; maxSimilarity: number; closestCorpusId?: string };
    codeExecution?: {
      passed: boolean;
      results: { testCaseId: string; passed: boolean; runtimeMs: number; output?: string; error?: string }[];
    };
  };
  passed: boolean;
  ranAt: string;
}

export interface EvalRun {
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

export interface RefinementIteration {
  iteration: number;
  triggeredBy: "hard_check_fail" | "soft_score_fail";
  failureSignal: string;
  outputId: string;
  scoreImprovement: number;
}

// ---------- Prompts ----------

export interface PromptVersion {
  id: string;
  promptType: "generation" | "concept_extraction" | "eval_judge" | "difficulty_assessor";
  dimension?: string;
  categoryId: CategoryId;
  version: number;
  body: string;
  createdBy: string;
  createdAt: string;
  active: boolean;
}

export interface PromptProposal {
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

export interface InstructorReview {
  id: string;
  assignmentId: string;
  reviewer: string;
  status: "approved" | "rejected" | "needs_changes";
  ratings: {
    dimension: string;
    score: number;
  }[];
  comments: string;
  reviewedAt: string;
}

// ---------- Assignment with lifecycle state ----------

export type AssignmentStatus =
  | "approved"
  | "awaiting_approval"
  | "rejected"
  | "failed_eval"
  | "failed_hard_check"
  | "in_progress";

export interface AssignmentRecord {
  assignment: GeneratedAssignment;
  verificationRuns: VerificationRun[];
  evalRuns: EvalRun[];
  refinementIterations: RefinementIteration[];
  instructorReview?: InstructorReview;
  status: AssignmentStatus;
  allIterationAssignments?: GeneratedAssignment[];
}

// ---------- Assignment Sections (grouped problems for a class) ----------

export type SectionType = "assignment" | "homework";

export type SectionStatus = "drafting" | "awaiting_approval" | "approved" | "rejected";

export interface AssignmentSection {
  id: string;
  name: string;
  type: SectionType;
  classContextId: string;
  problems: AssignmentRecord[];
  status: SectionStatus;
  createdAt: string;
  finalisedAt?: string;
  approverNote?: string;
}

// ---------- Audit log ----------

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  objectType: "assignment" | "gold_set_entry" | "concept" | "prompt" | "class_context" | "eval_run";
  objectId: string;
  action: string;
  versionDelta?: { from?: string | number; to?: string | number };
  details?: string;
}
