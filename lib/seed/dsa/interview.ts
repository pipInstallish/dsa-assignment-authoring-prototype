// Mock seed data for the DSA Interview sub-section.
// Kept separate from assignment data because the artifacts are different
// (rubric, hint ladder, follow-ups, multi-level solutions, solve-rate calibration).

export type InterviewProblemStatus =
  | "draft"
  | "awaiting_calibration"   // approved, deployed to < N candidates so solve-rate unreliable
  | "calibrated"              // enough data points to trust solve_rate
  | "retired";

// Both types are written coding — the distinction is *context*:
// - written_coding: standalone written assessment, candidate solves alone within a time budget.
// - written_coding_interview: live interview where candidate codes while an interviewer probes, hints, and asks follow-ups.
export type InterviewProblemType = "written_coding" | "written_coding_interview";

export const PROBLEM_TYPE_LABELS: Record<InterviewProblemType, string> = {
  written_coding: "Coding",
  written_coding_interview: "Interview",
};

export const PROBLEM_TYPE_DESCRIPTIONS: Record<InterviewProblemType, string> = {
  written_coding: "Written coding (standalone) — candidate solves alone within a time budget, no live interviewer.",
  written_coding_interview: "Written coding during interview — candidate codes live while interviewer probes, hints, and extends with follow-ups.",
};

export interface InterviewProblem {
  id: string;
  title: string;
  problemType: InterviewProblemType;
  primaryConcepts: string[];
  secondaryConcepts: string[];
  mustNotRequire: string[];
  difficulty: "easy" | "medium" | "hard";
  timeBudgetMin: number;
  domain: string;
  status: InterviewProblemStatus;
  // Estimated at generation time from proxy features
  estimatedSolveBand: string; // e.g. "50-70%"
  // Actual data — only meaningful once status === "calibrated"
  actualSolveRate: number | null;
  attemptsCount: number;
  // Differentiation: variance in candidate scores (higher = better signal)
  scoreVariance: number | null;
  // Anti-leakage: similarity to public corpus (lower = better)
  leakageScore: number | null;
  createdAt: string;
}

export const DSA_INTERVIEW_PROBLEMS: InterviewProblem[] = [
  {
    id: "iv_001",
    title: "Order Frequency Anomaly Detector",
    problemType: "written_coding_interview",
    primaryConcepts: ["hashmaps", "frequency_counting"],
    secondaryConcepts: ["arrays"],
    mustNotRequire: ["dynamic_programming_1d"],
    difficulty: "medium",
    timeBudgetMin: 30,
    domain: "e-commerce",
    status: "calibrated",
    estimatedSolveBand: "50-70%",
    actualSolveRate: 0.62,
    attemptsCount: 84,
    scoreVariance: 1.42,
    leakageScore: 0.18,
    createdAt: "2026-04-12",
  },
  {
    id: "iv_002",
    title: "Live Feed Deduplication Window",
    problemType: "written_coding_interview",
    primaryConcepts: ["sliding_window", "hashmaps"],
    secondaryConcepts: [],
    mustNotRequire: [],
    difficulty: "medium",
    timeBudgetMin: 30,
    domain: "social",
    status: "calibrated",
    estimatedSolveBand: "40-60%",
    actualSolveRate: 0.47,
    attemptsCount: 61,
    scoreVariance: 1.65,
    leakageScore: 0.22,
    createdAt: "2026-04-18",
  },
  {
    id: "iv_003",
    title: "Transaction Pair Reconciliation",
    problemType: "written_coding_interview",
    primaryConcepts: ["two_pointers", "sorting"],
    secondaryConcepts: ["arrays"],
    mustNotRequire: ["hashmaps"],
    difficulty: "hard",
    timeBudgetMin: 45,
    domain: "fintech",
    status: "awaiting_calibration",
    estimatedSolveBand: "25-45%",
    actualSolveRate: 0.31,
    attemptsCount: 14,
    scoreVariance: null,
    leakageScore: 0.14,
    createdAt: "2026-05-02",
  },
  {
    id: "iv_004",
    title: "Cart Abandonment Reason Classifier",
    problemType: "written_coding_interview",
    primaryConcepts: ["arrays", "hashmaps"],
    secondaryConcepts: [],
    mustNotRequire: [],
    difficulty: "easy",
    timeBudgetMin: 15,
    domain: "e-commerce",
    status: "calibrated",
    estimatedSolveBand: "70-85%",
    actualSolveRate: 0.78,
    attemptsCount: 102,
    scoreVariance: 0.84,
    leakageScore: 0.09,
    createdAt: "2026-03-22",
  },
  {
    id: "iv_005",
    title: "Promo Code Conflict Resolution",
    problemType: "written_coding",
    primaryConcepts: ["hashmaps"],
    secondaryConcepts: ["frequency_counting"],
    mustNotRequire: [],
    difficulty: "easy",
    timeBudgetMin: 25,
    domain: "e-commerce",
    status: "calibrated",
    estimatedSolveBand: "75-90%",
    actualSolveRate: 0.81,
    attemptsCount: 156,
    scoreVariance: 0.62,
    leakageScore: 0.05,
    createdAt: "2026-02-14",
  },
  {
    id: "iv_006",
    title: "Streaming Top-K Trending Products",
    problemType: "written_coding_interview",
    primaryConcepts: ["heaps", "hashmaps"],
    secondaryConcepts: ["sliding_window"],
    mustNotRequire: [],
    difficulty: "hard",
    timeBudgetMin: 45,
    domain: "e-commerce",
    status: "draft",
    estimatedSolveBand: "20-40%",
    actualSolveRate: null,
    attemptsCount: 0,
    scoreVariance: null,
    leakageScore: 0.28,
    createdAt: "2026-05-10",
  },
];

// Gold set entries — interview problems whose calibration is trusted enough
// to be used as few-shot examples in the generator prompt.
export interface InterviewGoldEntry {
  id: string;
  problemId: string;
  title: string;
  concepts: string[];
  difficulty: "easy" | "medium" | "hard";
  actualSolveRate: number;
  attempts: number;
  status: "canonical" | "candidate";
  signalAxes: string[];
  notes: string;
}

export const DSA_INTERVIEW_GOLD_SET: InterviewGoldEntry[] = [
  {
    id: "iv_gold_001",
    problemId: "iv_001",
    title: "Order Frequency Anomaly Detector",
    concepts: ["hashmaps", "frequency_counting"],
    difficulty: "medium",
    actualSolveRate: 0.62,
    attempts: 84,
    status: "canonical",
    signalAxes: ["decomposition", "edge-cases", "complexity-reasoning"],
    notes: "Discriminates well at the optimization step — brute force is obvious, optimal requires recognizing the counting invariant.",
  },
  {
    id: "iv_gold_002",
    problemId: "iv_002",
    title: "Live Feed Deduplication Window",
    concepts: ["sliding_window", "hashmaps"],
    difficulty: "medium",
    actualSolveRate: 0.47,
    attempts: 61,
    status: "canonical",
    signalAxes: ["pattern-recognition", "edge-cases"],
    notes: "Strong differentiator — score variance 1.65. Candidates split cleanly on whether they shrink the window correctly.",
  },
  {
    id: "iv_gold_003",
    problemId: "iv_004",
    title: "Cart Abandonment Reason Classifier",
    concepts: ["arrays", "hashmaps"],
    difficulty: "easy",
    actualSolveRate: 0.78,
    attempts: 102,
    status: "canonical",
    signalAxes: ["communication", "decomposition"],
    notes: "Open-ended discussion variant. Strong candidates surface 4+ hypotheses unprompted.",
  },
];

// Calibration deployments — records of problems sent into actual interviews.
export interface CalibrationRecord {
  problemId: string;
  problemTitle: string;
  cohort: string;
  date: string;
  attempts: number;
  solvedOptimal: number;
  solvedBrute: number;
  unsolved: number;
  avgTimeMin: number;
  rubricAgreement: number; // 0..1
}

export const DSA_INTERVIEW_CALIBRATION: CalibrationRecord[] = [
  { problemId: "iv_001", problemTitle: "Order Frequency Anomaly Detector", cohort: "NSET May'26 W1", date: "2026-05-04", attempts: 28, solvedOptimal: 11, solvedBrute: 6, unsolved: 11, avgTimeMin: 24, rubricAgreement: 0.86 },
  { problemId: "iv_001", problemTitle: "Order Frequency Anomaly Detector", cohort: "NSET Apr'26 W4", date: "2026-04-28", attempts: 32, solvedOptimal: 14, solvedBrute: 5, unsolved: 13, avgTimeMin: 26, rubricAgreement: 0.84 },
  { problemId: "iv_002", problemTitle: "Live Feed Deduplication Window", cohort: "NSET May'26 W1", date: "2026-05-04", attempts: 30, solvedOptimal: 9, solvedBrute: 5, unsolved: 16, avgTimeMin: 28, rubricAgreement: 0.91 },
  { problemId: "iv_003", problemTitle: "Transaction Pair Reconciliation", cohort: "NSET May'26 W2", date: "2026-05-11", attempts: 14, solvedOptimal: 3, solvedBrute: 2, unsolved: 9, avgTimeMin: 38, rubricAgreement: 0.79 },
  { problemId: "iv_004", problemTitle: "Cart Abandonment Reason Classifier", cohort: "NSET Mar'26 W3", date: "2026-03-25", attempts: 40, solvedOptimal: 28, solvedBrute: 4, unsolved: 8, avgTimeMin: 12, rubricAgreement: 0.88 },
  { problemId: "iv_005", problemTitle: "Promo Code Conflict Resolution", cohort: "NSET Feb'26 W2", date: "2026-02-18", attempts: 52, solvedOptimal: 41, solvedBrute: 3, unsolved: 8, avgTimeMin: 8, rubricAgreement: 0.93 },
];

// Difficulty rubric: what easy / medium / hard means.
// Differs by problem type — standalone written coding optimizes for defensive completeness
// (no interviewer to clarify with), while interview coding optimizes for productive dialogue
// (clarifications, brute → optimal climb, follow-up surface).
export function getDifficultyRubric(
  concepts: string[],
  difficulty: "easy" | "medium" | "hard",
  problemType: InterviewProblemType = "written_coding_interview"
) {
  const goldMatches = DSA_INTERVIEW_GOLD_SET.filter(g =>
    g.difficulty === difficulty && concepts.some(c => g.concepts.includes(c))
  );

  const rubrics: Record<InterviewProblemType, Record<"easy" | "medium" | "hard", { features: string[]; targetSolve: string }>> = {
    written_coding: {
      easy: {
        features: [
          "1 primary concept, fully specified problem",
          "Brute force passes the constraints — no optimization needed",
          "All edge cases callable out in the statement (no discovery expected)",
          "Reference solution is 15–25 lines",
          "Defensive input validation matters (no one to ask)",
        ],
        targetSolve: "~75% of qualified candidates within time",
      },
      medium: {
        features: [
          "1–2 concepts, statement is fully specified",
          "Brute force is O(n²) and TLEs on max constraints — optimization required",
          "Optimal needs one insight reachable from the problem framing",
          "3–4 edge cases — most listed, some discoverable through testing",
          "Test cases reward correctness on edges, not just happy path",
        ],
        targetSolve: "~55% of qualified candidates within time",
      },
      hard: {
        features: [
          "2–3 concepts, may require composition",
          "Brute force may not pass on examples, forcing optimization upfront",
          "Optimal requires 2 insights or a non-standard data structure",
          "Multiple edge cases including subtle ones (overflow, off-by-one, empty subproblem)",
          "Implementation is fiddly — a single bug fails many test cases",
        ],
        targetSolve: "~30% of qualified candidates within time",
      },
    },
    written_coding_interview: {
      easy: {
        features: [
          "1 primary concept",
          "Statement has 1 productive ambiguity — candidate should clarify before coding",
          "Brute force is acceptable; interviewer may or may not probe for optimization",
          "1–2 edge cases discoverable through dialogue",
          "Communication carries equal weight to code correctness",
        ],
        targetSolve: "~70% reach optimal with dialogue",
      },
      medium: {
        features: [
          "1–2 concepts, naturally composed",
          "Statement has 2–3 productive ambiguities — clarifying questions expected",
          "Brute force is O(n²) and obvious; interviewer probes for optimization",
          "Optimal requires one non-obvious insight reachable via H1 / H2 hint",
          "2–3 edge cases candidate should discover through dialogue, not from spec",
          "At least one natural follow-up (streaming / online variant)",
        ],
        targetSolve: "~55% reach optimal with dialogue",
      },
      hard: {
        features: [
          "2–3 concepts composed non-obviously",
          "3+ clarifying questions expected before code",
          "Brute force may not be obvious — candidate has to invent one",
          "Multiple valid optimal approaches with real trade-offs (time vs space, online vs batch)",
          "Optimal requires 2 insights or non-standard data structure",
          "Follow-ups extend to streaming, distributed, or online variants requiring different insights",
        ],
        targetSolve: "~30% reach optimal with dialogue + hints",
      },
    },
  };

  return {
    ...rubrics[problemType][difficulty],
    goldExamples: goldMatches.length,
    calibrationStrength: goldMatches.length >= 3 ? "strong" : goldMatches.length >= 1 ? "moderate" : "weak",
  };
}

// Standalone written coding tends to need more clock time (defensive testing, no one to ask).
// Live interview coding compresses thinking time because dialogue accelerates clarification.
export const DIFFICULTY_TIME_DEFAULTS: Record<InterviewProblemType, Record<"easy" | "medium" | "hard", number>> = {
  written_coding: {
    easy: 20,
    medium: 40,
    hard: 60,
  },
  written_coding_interview: {
    easy: 15,
    medium: 30,
    hard: 45,
  },
};

// A fully-formed mock generated interview problem (what the generator returns).
export interface GeneratedInterviewProblem {
  id: string;
  title: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string[];
  rubric: {
    axis: string;
    band1: string; // weak
    band3: string; // baseline
    band5: string; // strong
  }[];
  hintLadder: { level: 1 | 2 | 3; hint: string }[];
  followUps: string[];
  solutions: {
    level: "brute" | "intermediate" | "optimal";
    complexityTime: string;
    complexitySpace: string;
    code: string;
    insight: string;
  }[];
  redFlags: string[];
  edgeCases: string[];
  leakageScore: number;
  estimatedSolveBand: string;
}

export const MOCK_GENERATED_INTERVIEW: GeneratedInterviewProblem = {
  id: "iv_gen_preview",
  title: "Refund Window Anomaly",
  statement:
    "An e-commerce platform processes refunds in real time. You're given a stream of refund events, each tagged with a user ID and a timestamp (in seconds). The platform considers a user's refund pattern \"anomalous\" if they request more than K refunds within any rolling window of W seconds. Given the stream and parameters K and W, return the list of user IDs flagged as anomalous in the order they were first flagged.",
  inputFormat: "events: list of (user_id: str, timestamp: int), K: int, W: int (seconds)",
  outputFormat: "list of user_ids (strings) in order of first flagging",
  exampleInput: 'events = [("u1", 0), ("u1", 10), ("u2", 5), ("u1", 50), ("u1", 60)], K = 2, W = 30',
  exampleOutput: '["u1"]',
  constraints: [
    "1 <= len(events) <= 10^5",
    "1 <= K <= 100",
    "1 <= W <= 10^6",
    "Events are sorted by timestamp",
    "User IDs are arbitrary strings",
  ],
  rubric: [
    {
      axis: "Problem decomposition",
      band1: "Doesn't separate per-user state from global flagging logic",
      band3: "Identifies need for per-user time-windows; states approach clearly",
      band5: "Articulates streaming vs batch trade-off without prompting",
    },
    {
      axis: "Optimization reasoning",
      band1: "Goes straight to nested loop, doesn't notice cost",
      band3: "Recognizes brute force is O(n²) per user; proposes sliding window",
      band5: "Justifies deque-of-timestamps with amortized O(1) per event",
    },
    {
      axis: "Edge cases",
      band1: "Misses empty input and single-user-spam scenarios",
      band3: "Handles empty input, single event, K=1 boundary",
      band5: "Catches the duplicate-timestamp tie-breaking case unprompted",
    },
    {
      axis: "Communication",
      band1: "Codes silently; no narration of intent",
      band3: "Narrates approach before coding; explains trade-offs when asked",
      band5: "Proactively highlights assumptions and asks clarifying questions",
    },
  ],
  hintLadder: [
    { level: 1, hint: "What's the maximum number of refunds you'd need to track per user at any moment?" },
    { level: 2, hint: "For each user, you only care about refunds within the last W seconds. What data structure supports adding to one end and removing from the other efficiently?" },
    { level: 3, hint: "Use a deque per user. On each new event, pop from the front while the oldest timestamp is older than (current - W). After cleaning, if the deque size exceeds K, flag the user." },
  ],
  followUps: [
    "What if events arrive out of order (network delay)?",
    "What if you need to support a rolling 24-hour window with millions of events per minute — would you keep all timestamps in memory?",
    "How would you parallelize this across users running on different machines?",
  ],
  solutions: [
    {
      level: "brute",
      complexityTime: "O(n²)",
      complexitySpace: "O(n)",
      code: `def find_anomalous(events, K, W):
    flagged = []
    flagged_set = set()
    for i, (uid, t) in enumerate(events):
        if uid in flagged_set:
            continue
        count = 0
        for j in range(i + 1):
            if events[j][0] == uid and t - events[j][1] <= W:
                count += 1
        if count > K:
            flagged.append(uid)
            flagged_set.add(uid)
    return flagged`,
      insight: "Re-scans history for each event. Correct but quadratic.",
    },
    {
      level: "optimal",
      complexityTime: "O(n)",
      complexitySpace: "O(n)",
      code: `from collections import deque, defaultdict

def find_anomalous(events, K, W):
    per_user = defaultdict(deque)
    flagged = []
    flagged_set = set()
    for uid, t in events:
        if uid in flagged_set:
            continue
        dq = per_user[uid]
        while dq and t - dq[0] > W:
            dq.popleft()
        dq.append(t)
        if len(dq) > K:
            flagged.append(uid)
            flagged_set.add(uid)
    return flagged`,
      insight: "Deque per user gives amortized O(1) per event. Each timestamp is pushed and popped at most once.",
    },
  ],
  redFlags: [
    "Uses a global deque instead of per-user state — fundamental misunderstanding",
    "Stores all events per user without pruning — works on examples, fails on constraints",
    "Forgets to mark user as flagged and re-flags them on subsequent events",
    "Uses dict-of-lists with .remove() — O(n) per event, regresses to quadratic",
  ],
  edgeCases: [
    "Empty events list",
    "K = 1 (any single repeat flags)",
    "Single user, all events within W (must flag at the K+1th event)",
    "Duplicate timestamps for same user",
    "Very large W compared to event range (window covers everything)",
  ],
  leakageScore: 0.16,
  estimatedSolveBand: "50-70%",
};
