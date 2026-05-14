import type { AssignmentRecord, GeneratedAssignment, VerificationRun, EvalRun, RefinementIteration, InstructorReview } from "../../types";

const PIPELINE_VERSIONS = {
  pipelineVersion: "pipeline:1.4.2",
  promptVersion: "prompt-generation-v3",
  judgeVersion: "prompt-judge-clarity-v1",
  taxonomyVersion: 1,
  goldSetVersion: 1
};

function makeVerification(id: string, assignmentId: string, passed: boolean, extras?: Partial<VerificationRun["hardChecks"]>): VerificationRun {
  return {
    id,
    assignmentId,
    hardChecks: {
      schemaValid: true,
      conceptCoverage: { passed: true, missing: [] },
      conceptContainment: { passed: true, outOfScope: [] },
      conceptExclusion: { passed: true, violated: [] },
      difficultyInBand: { passed: true, details: "Score 0.42 within [0.3, 0.6] for medium" },
      leakage: { passed: true, maxSimilarity: 0.28, closestCorpusId: "q-two-sum" },
      codeExecution: {
        passed: true,
        results: [
          { testCaseId: "tc1", passed: true, runtimeMs: 42 },
          { testCaseId: "tc2", passed: true, runtimeMs: 38 },
          { testCaseId: "tc3", passed: true, runtimeMs: 41 },
          { testCaseId: "tc4", passed: true, runtimeMs: 39 },
          { testCaseId: "tc5", passed: true, runtimeMs: 44 },
          { testCaseId: "tc6", passed: true, runtimeMs: 156 }
        ]
      },
      ...extras
    },
    passed,
    ranAt: "2026-02-01T10:05:00Z"
  };
}

function makeEvalRun(id: string, assignmentId: string, scores: Record<string, number>, passedThresholds: boolean): EvalRun {
  const dimensions = ["problem_clarity", "test_case_coverage", "complexity_correctness", "concept_rubric_alignment", "real_world_fidelity", "novelty"];
  const perDimensionScores = dimensions.map(d => ({
    dimension: d,
    medianScore: scores[d] ?? 4.0,
    individualRuns: [
      { score: Math.max(1, (scores[d] ?? 4.0) - 0.5), reasoning: `The assignment shows adequate ${d.replace(/_/g, " ")} but has minor room for improvement.` },
      { score: scores[d] ?? 4.0, reasoning: `Good ${d.replace(/_/g, " ")} overall with clear evidence in the problem statement.` },
      { score: Math.min(5, (scores[d] ?? 4.0) + 0.5), reasoning: `Strong ${d.replace(/_/g, " ")} — criteria are met with specificity.` }
    ]
  }));
  const compositeScore = Object.values(scores).reduce((a, b) => a + b, 0) / dimensions.length;
  return {
    id,
    assignmentId,
    perDimensionScores,
    compositeScore,
    passedThresholds,
    thresholdsUsed: dimensions.map(d => ({
      dimension: d,
      threshold: 3.5,
      source: "gold_set" as const
    })),
    ranAt: "2026-02-01T10:06:00Z"
  };
}

// ===== assign-001: Approved, high scores, single iteration =====
const ASSIGN_001: GeneratedAssignment = {
  id: "assign-001",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-arrays-and-hashing",
    targetConcepts: { primary: ["hashmaps", "frequency_counting"], secondary: ["arrays"], mustNotRequire: ["dynamic_programming_2d", "graphs"] },
    difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 25, expectedConceptCount: 2, constraintComplexity: "moderate" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "e-commerce", avoidOverused: ["two_sum"] },
    corpusSliceIds: ["q-two-sum", "q-group-anagrams"]
  },
  problem: {
    title: "Most Frequently Ordered Product Category",
    statement: `An e-commerce analytics service needs to identify customer ordering patterns. Given a list of product category IDs ordered by a customer over the past year, find the **most frequently ordered category**. If there's a tie, return the category that appeared first in the original list.\n\nReturn the category ID as an integer.`,
    inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Second line: n space-separated integers representing category IDs.",
    outputFormat: "A single integer: the most frequently ordered category ID.",
    constraints: ["1 ≤ n ≤ 100,000", "1 ≤ category_id ≤ 10^9", "Time limit: 2 seconds"],
    examples: [
      { input: "6\n3 1 4 1 5 1", output: "1", explanation: "Category 1 appears 3 times, more than any other." },
      { input: "4\n7 2 7 2", output: "7", explanation: "Both 7 and 2 appear twice; 7 appeared first so it wins." }
    ]
  },
  starterCode: [{ language: "python", code: `def most_frequent_category(categories: list[int]) -> int:\n    pass\n\nif __name__ == "__main__":\n    n = int(input())\n    cats = list(map(int, input().split()))\n    print(most_frequent_category(cats))` }],
  referenceSolution: {
    language: "python",
    code: `def most_frequent_category(categories):\n    freq = {}\n    for cat in categories:\n        freq[cat] = freq.get(cat, 0) + 1\n    best_cat = categories[0]\n    best_count = freq[categories[0]]\n    first_seen = {categories[0]: 0}\n    for i, cat in enumerate(categories[1:], 1):\n        if cat not in first_seen:\n            first_seen[cat] = i\n    for cat, count in freq.items():\n        if count > best_count or (count == best_count and first_seen[cat] < first_seen[best_cat]):\n            best_count = count\n            best_cat = cat\n    return best_cat\n\nif __name__ == "__main__":\n    n = int(input())\n    cats = list(map(int, input().split()))\n    print(most_frequent_category(cats))`,
    complexityTime: "O(n)",
    complexitySpace: "O(k) where k is distinct categories"
  },
  bruteForceSolution: {
    language: "python",
    code: `from collections import Counter\ndef most_frequent_category(categories):\n    freq = Counter(categories)\n    max_count = max(freq.values())\n    for cat in categories:\n        if freq[cat] == max_count:\n            return cat`
  },
  testCases: [
    { id: "tc1", input: "6\n3 1 4 1 5 1", expectedOutput: "1", visibility: "sample", rationale: "Clear winner by frequency." },
    { id: "tc2", input: "4\n7 2 7 2", expectedOutput: "7", visibility: "sample", rationale: "Tie broken by first appearance." },
    { id: "tc3", input: "1\n42", expectedOutput: "42", visibility: "hidden", rationale: "Single element." },
    { id: "tc4", input: "3\n5 5 5", expectedOutput: "5", visibility: "hidden", rationale: "All same." },
    { id: "tc5", input: "4\n1 2 3 4", expectedOutput: "1", visibility: "hidden", rationale: "All same frequency; first in list wins." },
    { id: "tc6", input: "6\n2 1 2 1 2 1", expectedOutput: "2", visibility: "hidden", rationale: "2 and 1 tied; 2 appeared first." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Frequency counting with hashmap",
        weight: 0.5,
        anchors: { 5: "Uses dict/Counter for O(n) counting. Single pass.", 3: "Correct but suboptimal (sort-based).", 1: "Nested loops — O(n²)." },
        evidenceRequired: "dict or Counter usage visible in solution"
      },
      {
        dimension: "Tie-breaking by first appearance",
        weight: 0.3,
        anchors: { 5: "Tracks first seen index; correctly breaks ties.", 3: "Handles most ties but edge case fails.", 1: "No tie handling." },
        evidenceRequired: "Passes tc2, tc5, tc6"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: { 5: "Single element and all-same handled.", 3: "One edge fails.", 1: "Multiple edges fail." },
        evidenceRequired: "Passes tc3, tc4"
      }
    ],
    conceptsBeingAssessed: ["hashmaps", "frequency_counting"],
    redFlags: ["uses sort (loses ordering needed for tie-break)", "returns wrong element on tie", "doesn't handle single element"]
  },
  metadata: {
    conceptsRequired: ["hashmaps", "frequency_counting", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.38,
    estimatedSolveTimeMinutes: 22,
    realWorldDomain: "e-commerce",
    noveltyHash: "h-ecomm-cat-001",
    sourceInspirations: [{ corpusId: "q-group-anagrams", similarity: 0.3 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Frequency counting is primary; the tie-breaking by first appearance adds a real-world constraint that separates Counter from a more careful implementation.",
    scenarioSelectionRationale: "E-commerce category analytics is a real daily workload.",
    difficultyCalibrationRationale: "Medium-easy: one main concept, but the tie-breaking adds implementation complexity.",
    deviationsFromCorpus: "Group-anagrams also uses frequency but for grouping, not ranking; different output structure."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-01T10:00:00Z"
};

// ===== assign-002: Approved, after one refinement (2 iterations) =====
const ASSIGN_002_V1: GeneratedAssignment = {
  id: "assign-002-v1",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-sliding-window-and-prefix",
    targetConcepts: { primary: ["sliding_window"], secondary: ["hashmaps"], mustNotRequire: ["dynamic_programming_1d", "heaps"] },
    difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "networking", avoidOverused: ["max_average_subarray"] },
    corpusSliceIds: ["q-longest-unique-substring"]
  },
  problem: {
    title: "Longest Valid Session Window",
    statement: `A network monitoring tool tracks user sessions as a sequence of session states: "active" (1) or "idle" (0). The quality team wants the length of the **longest contiguous subarray containing at most K idle sessions**, as this represents a "valid engagement window".\n\nGiven an array \`sessions\` of 0s and 1s and integer K, return the length of the longest subarray with at most K zeros.`,
    inputFormat: "First line: integers n and K. Second line: n space-separated integers (0 or 1).",
    outputFormat: "A single integer: length of the longest valid window.",
    constraints: ["1 ≤ n ≤ 100,000", "0 ≤ K ≤ n"],
    examples: [
      { input: "8 2\n1 0 1 1 0 1 0 1", output: "7", explanation: "Window [0,1,1,0,1,0,1] has 2 zeros, length 7." },
      { input: "5 0\n1 1 1 1 1", output: "5", explanation: "No zeros; entire array is valid." }
    ]
  },
  starterCode: [{ language: "python", code: `def longest_valid_window(sessions: list[int], k: int) -> int:\n    pass` }],
  referenceSolution: {
    language: "python",
    code: `def longest_valid_window(sessions, k):\n    left = 0\n    zeros = 0\n    best = 0\n    for right in range(len(sessions)):\n        if sessions[right] == 0:\n            zeros += 1\n        while zeros > k:\n            if sessions[left] == 0:\n                zeros -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def longest_valid_window(sessions, k):\n    best = 0\n    for i in range(len(sessions)):\n        zeros = 0\n        for j in range(i, len(sessions)):\n            if sessions[j] == 0:\n                zeros += 1\n            if zeros > k:\n                break\n            best = max(best, j - i + 1)\n    return best`
  },
  testCases: [
    { id: "tc1", input: "8 2\n1 0 1 1 0 1 0 1", expectedOutput: "7", visibility: "sample", rationale: "Standard case." },
    { id: "tc2", input: "5 0\n1 1 1 1 1", expectedOutput: "5", visibility: "sample", rationale: "K=0, no zeros." },
    { id: "tc3", input: "1 0\n0", expectedOutput: "0", visibility: "hidden", rationale: "Single zero, K=0 → length 0." },
    { id: "tc4", input: "3 3\n0 0 0", expectedOutput: "3", visibility: "hidden", rationale: "K >= total zeros." },
    { id: "tc5", input: "6 1\n0 1 0 1 0 1", expectedOutput: "3", visibility: "hidden", rationale: "Alternating; best window length 3." },
    { id: "tc6", input: "5 2\n1 0 0 0 1", expectedOutput: "4", visibility: "hidden", rationale: "Three zeros in middle; K=2 means window can have at most 2." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Variable sliding window with zero count",
        weight: 0.5,
        anchors: { 5: "Maintains zero count, expands right, shrinks left when count > K. O(n).", 3: "Window correct but O(n²) update.", 1: "No sliding window." },
        evidenceRequired: "Two-pointer expand-shrink pattern"
      },
      {
        dimension: "Correct window answer tracking",
        weight: 0.3,
        anchors: { 5: "Tracks max window size correctly at each step.", 3: "Off-by-one in size calculation.", 1: "Wrong size tracked." },
        evidenceRequired: "right - left + 1 used correctly"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: { 5: "K=0, all-zeros, all-ones handled.", 3: "One edge fails.", 1: "Multiple fail." },
        evidenceRequired: "Passes tc2, tc3, tc4"
      }
    ],
    conceptsBeingAssessed: ["sliding_window"],
    redFlags: ["uses prefix sum instead of window", "wrong tie for alignment — scores low on concept_rubric_alignment"]
  },
  metadata: {
    conceptsRequired: ["sliding_window", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.45,
    estimatedSolveTimeMinutes: 28,
    realWorldDomain: "networking",
    noveltyHash: "h-session-win-002a",
    sourceInspirations: [{ corpusId: "q-longest-unique-substring", similarity: 0.38 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Variable sliding window is the target; binary session states simplify the window state to a single counter.",
    scenarioSelectionRationale: "Network session quality monitoring is a real infrastructure use case.",
    difficultyCalibrationRationale: "Medium: the variable-window with shrink logic is the key challenge.",
    deviationsFromCorpus: "Longest-substring-without-repeats uses hashmap for window state; this uses a simpler counter but variable window."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-03T10:00:00Z"
};

const ASSIGN_002_V2: GeneratedAssignment = {
  ...ASSIGN_002_V1,
  id: "assign-002",
  versions: { ...PIPELINE_VERSIONS, pipelineVersion: "pipeline:1.4.2-refined" },
  createdAt: "2026-02-03T10:12:00Z",
  rubric: {
    ...ASSIGN_002_V1.rubric,
    evaluationDimensions: [
      {
        dimension: "Variable sliding window with zero count",
        weight: 0.4,
        anchors: { 5: "Maintains zero count, expands right, shrinks left when count > K. O(n). Window state is minimal (just a count).", 3: "Window correct but O(n²) update.", 1: "No sliding window." },
        evidenceRequired: "Two-pointer expand-shrink pattern"
      },
      {
        dimension: "Correct window answer tracking",
        weight: 0.3,
        anchors: { 5: "Tracks max window size correctly at each step using right - left + 1.", 3: "Off-by-one in size calculation.", 1: "Wrong size tracked." },
        evidenceRequired: "right - left + 1 used correctly"
      },
      {
        dimension: "Sliding window concept alignment in rubric",
        weight: 0.2,
        anchors: { 5: "Every rubric dimension directly assesses the sliding window pattern being tested.", 3: "Most dimensions align but one grades off-topic.", 1: "Rubric doesn't align with problem." },
        evidenceRequired: "Rubric dimensions reference sliding window idioms"
      },
      {
        dimension: "Edge cases",
        weight: 0.1,
        anchors: { 5: "K=0, all-zeros, all-ones handled.", 3: "One edge fails.", 1: "Multiple fail." },
        evidenceRequired: "Passes tc2, tc3, tc4"
      }
    ]
  }
};

// ===== assign-003: Awaiting instructor approval =====
const ASSIGN_003: GeneratedAssignment = {
  id: "assign-003",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-trees-and-recursion",
    targetConcepts: { primary: ["tree_traversal_dfs"], secondary: ["recursion", "trees"], mustNotRequire: ["dynamic_programming_1d", "heaps"] },
    difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "file_systems", avoidOverused: ["path_sum"] },
    corpusSliceIds: ["q-binary-tree-inorder"]
  },
  problem: {
    title: "Deepest Directory with Exactly One File",
    statement: `A filesystem is represented as a binary tree where each node has a value representing the number of files in that directory. Find the depth of the **deepest node** that contains exactly one file. Root is at depth 0.\n\nReturn the depth, or -1 if no such node exists.`,
    inputFormat: "First line: integer n. Next n lines: 'val left_idx right_idx' (BST-style build).",
    outputFormat: "A single integer: deepest depth of a node with value 1, or -1.",
    constraints: ["1 ≤ n ≤ 100,000", "Time: 2 seconds"],
    examples: [
      { input: "5\n3 1 2\n1 3 -1\n2 4 -1\n1 -1 -1\n1 -1 -1", output: "2", explanation: "Nodes with value 1 at depths 1, 2, 2. Deepest is depth 2." },
      { input: "1\n5 -1 -1", output: "-1", explanation: "No node has value 1." }
    ]
  },
  starterCode: [{ language: "python", code: `def deepest_single_file(root) -> int:\n    pass` }],
  referenceSolution: {
    language: "python",
    code: `def deepest_single_file(root):\n    result = [-1]\n    def dfs(node, depth):\n        if node is None:\n            return\n        if node.val == 1:\n            result[0] = max(result[0], depth)\n        dfs(node.left, depth + 1)\n        dfs(node.right, depth + 1)\n    dfs(root, 0)\n    return result[0]`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)"
  },
  bruteForceSolution: undefined,
  testCases: [
    { id: "tc1", input: "5\n3 1 2\n1 3 -1\n2 4 -1\n1 -1 -1\n1 -1 -1", expectedOutput: "2", visibility: "sample", rationale: "Multiple matching nodes." },
    { id: "tc2", input: "1\n5 -1 -1", expectedOutput: "-1", visibility: "sample", rationale: "No match." },
    { id: "tc3", input: "1\n1 -1 -1", expectedOutput: "0", visibility: "hidden", rationale: "Root matches at depth 0." },
    { id: "tc4", input: "3\n2 1 2\n1 -1 -1\n1 -1 -1", expectedOutput: "1", visibility: "hidden", rationale: "Both children match at depth 1." },
    { id: "tc5", input: "2\n2 1 -1\n1 -1 -1", expectedOutput: "1", visibility: "hidden", rationale: "Match at depth 1 only." },
    { id: "tc6", input: "3\n1 1 2\n1 -1 -1\n1 -1 -1", expectedOutput: "1", visibility: "hidden", rationale: "Root matches at 0, children at 1; return deepest (1)." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "DFS with depth tracking",
        weight: 0.5,
        anchors: { 5: "Passes depth parameter through recursive calls; correctly updates global max.", 3: "DFS correct but uses BFS for depth (fine but suboptimal).", 1: "No recursion or DFS." },
        evidenceRequired: "Recursive DFS with depth parameter"
      },
      {
        dimension: "Global result tracking",
        weight: 0.3,
        anchors: { 5: "Correctly tracks maximum depth with nonlocal/closure.", 3: "Works but uses mutable default arg hack.", 1: "Wrong result accumulation." },
        evidenceRequired: "result tracked across recursive calls"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: { 5: "-1 for no match; root match returns 0.", 3: "One edge wrong.", 1: "Multiple wrong." },
        evidenceRequired: "Passes tc2, tc3"
      }
    ],
    conceptsBeingAssessed: ["tree_traversal_dfs"],
    redFlags: ["uses BFS (misses DFS concept)", "wrong depth tracking", "crashes on empty tree"]
  },
  metadata: {
    conceptsRequired: ["tree_traversal_dfs", "recursion", "trees"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.48,
    estimatedSolveTimeMinutes: 28,
    realWorldDomain: "file_systems",
    noveltyHash: "h-deep-dir-003",
    sourceInspirations: [{ corpusId: "q-binary-tree-inorder", similarity: 0.25 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "DFS with depth tracking is the target; the filesystem framing makes depth concrete.",
    scenarioSelectionRationale: "Filesystem traversal is a real use case for DFS.",
    difficultyCalibrationRationale: "Medium: recursion + result tracking via closure/nonlocal is the key complexity.",
    deviationsFromCorpus: "Inorder traversal is positional; this uses DFS to find a value condition at depth."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-05T10:00:00Z"
};

// ===== assign-004: Rejected by instructor =====
const ASSIGN_004: GeneratedAssignment = {
  id: "assign-004",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-heaps-and-stacks",
    targetConcepts: { primary: ["monotonic_stack"], secondary: ["stacks", "arrays"], mustNotRequire: ["dynamic_programming_1d"] },
    difficultyTarget: { tier: "hard", expectedSolveTimeMinutes: 45, expectedConceptCount: 2, constraintComplexity: "many" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "financial", avoidOverused: ["daily_temperatures"] },
    corpusSliceIds: []
  },
  problem: {
    title: "Next Higher Bid in Auction Queue",
    statement: `An auction system processes bids in sequence. For each bid, find the next bid in the sequence that is strictly higher. Return 0 if no higher bid follows.\n\nGiven an array of bid amounts, return an array of the same length with the next higher bid for each position.`,
    inputFormat: "First line: integer n. Second line: n space-separated integers.",
    outputFormat: "n space-separated integers.",
    constraints: ["1 ≤ n ≤ 100,000", "1 ≤ bid_i ≤ 10^9"],
    examples: [
      { input: "5\n4 2 8 1 5", output: "8 8 0 5 0", explanation: "4→8, 2→8, 8→none(0), 1→5, 5→none(0)." },
      { input: "3\n1 2 3", output: "2 3 0", explanation: "Each next element is higher; last has none." }
    ]
  },
  starterCode: [{ language: "python", code: `def next_higher_bid(bids: list[int]) -> list[int]:\n    pass` }],
  referenceSolution: {
    language: "python",
    code: `def next_higher_bid(bids):\n    n = len(bids)\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        while stack and bids[stack[-1]] < bids[i]:\n            res[stack.pop()] = bids[i]\n        stack.append(i)\n    return res`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def next_higher_bid(bids):\n    res = []\n    for i in range(len(bids)):\n        found = 0\n        for j in range(i+1, len(bids)):\n            if bids[j] > bids[i]:\n                found = bids[j]\n                break\n        res.append(found)\n    return res`
  },
  testCases: [
    { id: "tc1", input: "5\n4 2 8 1 5", expectedOutput: "8 8 0 5 0", visibility: "sample", rationale: "Mixed case." },
    { id: "tc2", input: "3\n1 2 3", expectedOutput: "2 3 0", visibility: "sample", rationale: "Increasing." },
    { id: "tc3", input: "1\n5", expectedOutput: "0", visibility: "hidden", rationale: "Single element." },
    { id: "tc4", input: "4\n5 4 3 2", expectedOutput: "0 0 0 0", visibility: "hidden", rationale: "Decreasing." },
    { id: "tc5", input: "5\n3 3 3 3 3", expectedOutput: "0 0 0 0 0", visibility: "hidden", rationale: "All equal — strictly higher." },
    { id: "tc6", input: "6\n1 3 2 4 2 5", expectedOutput: "3 4 4 5 5 0", visibility: "hidden", rationale: "Complex mixed." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Monotonic stack for next-greater",
        weight: 0.6,
        anchors: { 5: "Maintains monotonically decreasing stack of indices; resolves on finding a higher bid. O(n).", 3: "Partially correct stack usage.", 1: "Brute force O(n²)." },
        evidenceRequired: "Stack pop on finding higher value"
      },
      {
        dimension: "Correct output format",
        weight: 0.2,
        anchors: { 5: "Returns bid values (not indices); 0 for unresolved.", 3: "Returns indices instead of values.", 1: "Wrong output." },
        evidenceRequired: "res contains bid values"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: { 5: "Single element, decreasing, all-equal handled.", 3: "One edge wrong.", 1: "Multiple wrong." },
        evidenceRequired: "Passes tc3, tc4, tc5"
      }
    ],
    conceptsBeingAssessed: ["monotonic_stack"],
    redFlags: ["O(n²) nested loops", "returns wrong value on all-equal input"]
  },
  metadata: {
    conceptsRequired: ["monotonic_stack", "stacks", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.52,
    estimatedSolveTimeMinutes: 38,
    realWorldDomain: "financial",
    noveltyHash: "h-next-bid-004",
    sourceInspirations: []
  },
  reasoningTrace: {
    conceptSelectionRationale: "Next-greater-element is the canonical monotonic stack problem.",
    scenarioSelectionRationale: "Auction bid processing is a real financial use case.",
    difficultyCalibrationRationale: "Hard: monotonic stack pattern is non-obvious; the stack-of-indices vs stack-of-values distinction is a common mistake.",
    deviationsFromCorpus: "No direct corpus match for this pattern."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-07T10:00:00Z"
};

// ===== assign-005: Failed eval (max iterations exhausted) =====
const ASSIGN_005_V1: GeneratedAssignment = {
  id: "assign-005-v1",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-arrays-and-hashing",
    targetConcepts: { primary: ["dynamic_programming_1d"], secondary: ["arrays"], mustNotRequire: ["graphs", "heaps"] },
    difficultyTarget: { tier: "hard", expectedSolveTimeMinutes: 50, expectedConceptCount: 3, constraintComplexity: "many" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "finance", avoidOverused: ["house_robber", "coin_change"] },
    corpusSliceIds: ["q-coin-change", "q-word-break"]
  },
  problem: {
    title: "Optimal Stock Trade Sequence",
    statement: `Given daily stock prices, find the maximum profit from at most 2 non-overlapping trades. Each trade is buy-then-sell. You must sell before buying again.`,
    inputFormat: "First line: integer n. Second line: n space-separated integers (prices).",
    outputFormat: "Maximum profit as integer.",
    constraints: ["1 ≤ n ≤ 100,000", "0 ≤ price ≤ 10^4"],
    examples: [
      { input: "6\n3 3 5 0 0 3", output: "6", explanation: "Buy at 0 (day 3), sell at 3 (day 5) → profit 3. Buy at 0 (day 4), sell at 3 (day 5) — actually max is buy day3 sell day5 and buy day0... complex." },
      { input: "1\n5", output: "0", explanation: "Only one price — no trade possible." }
    ]
  },
  starterCode: [{ language: "python", code: `def max_profit_two_trades(prices: list[int]) -> int:\n    pass` }],
  referenceSolution: {
    language: "python",
    code: `def max_profit_two_trades(prices):\n    if len(prices) < 2: return 0\n    n = len(prices)\n    left = [0] * n\n    min_price = prices[0]\n    for i in range(1, n):\n        min_price = min(min_price, prices[i])\n        left[i] = max(left[i-1], prices[i] - min_price)\n    right = [0] * n\n    max_price = prices[-1]\n    for i in range(n-2, -1, -1):\n        max_price = max(max_price, prices[i])\n        right[i] = max(right[i+1], max_price - prices[i])\n    return max(left[i] + right[i] for i in range(n))`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)"
  },
  bruteForceSolution: { language: "python", code: `def max_profit_two_trades(prices):\n    n = len(prices)\n    best = 0\n    for i in range(n):\n        p1 = 0\n        for j in range(i):\n            p1 = max(p1, prices[i] - prices[j])\n        for k in range(i, n):\n            p2 = 0\n            for l in range(k, n):\n                p2 = max(p2, prices[l] - prices[k])\n            best = max(best, p1 + p2)\n    return best` },
  testCases: [
    { id: "tc1", input: "6\n3 3 5 0 0 3", expectedOutput: "6", visibility: "sample", rationale: "Two trades possible." },
    { id: "tc2", input: "1\n5", expectedOutput: "0", visibility: "sample", rationale: "Single price." },
    { id: "tc3", input: "5\n1 2 3 4 5", expectedOutput: "4", visibility: "hidden", rationale: "One trade is optimal." },
    { id: "tc4", input: "4\n7 6 4 3", expectedOutput: "0", visibility: "hidden", rationale: "Decreasing — no profit." },
    { id: "tc5", input: "6\n1 3 1 5 2 6", expectedOutput: "7", visibility: "hidden", rationale: "Two separate trades: (1→3) + (1→5) or (1→3) + (2→6)." },
    { id: "tc6", input: "4\n1 4 1 4", expectedOutput: "6", visibility: "hidden", rationale: "Buy 1 sell 4, buy 1 sell 4 → profit 6." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Two-pass DP for max-two-trades",
        weight: 0.5,
        anchors: { 5: "Uses left[i] and right[i] arrays correctly; combines for answer.", 3: "One pass correct but second wrong.", 1: "No DP — brute force." },
        evidenceRequired: "Two separate DP arrays visible"
      },
      {
        dimension: "Concept-rubric alignment — DP state design",
        weight: 0.3,
        anchors: { 5: "Every dimension assesses DP recurrence and state transitions.", 3: "Partially aligned.", 1: "Misaligned." },
        evidenceRequired: "Rubric explicitly references DP states"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: { 5: "n=1, all-decreasing handled.", 3: "One edge wrong.", 1: "Multiple wrong." },
        evidenceRequired: "Passes tc2, tc4"
      }
    ],
    conceptsBeingAssessed: ["dynamic_programming_1d"],
    redFlags: ["off-by-one in DP transitions", "wrong DP state design", "misses the split-index optimization"]
  },
  metadata: {
    conceptsRequired: ["dynamic_programming_1d", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.72,
    estimatedSolveTimeMinutes: 48,
    realWorldDomain: "finance",
    noveltyHash: "h-stock-2trade-005",
    sourceInspirations: [{ corpusId: "q-coin-change", similarity: 0.2 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Two-trades-at-most is a hard 1D DP requiring left and right passes — high concept demand.",
    scenarioSelectionRationale: "Stock trading is a classic DP domain.",
    difficultyCalibrationRationale: "Hard: non-obvious two-pass construction; difficult to reach in 50 minutes without prior exposure.",
    deviationsFromCorpus: "Coin change is bottom-up DP but unbounded; this has fixed k=2 trades with split-index."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-08T10:00:00Z"
};

const ASSIGN_005_V2: GeneratedAssignment = { ...ASSIGN_005_V1, id: "assign-005-v2", createdAt: "2026-02-08T10:15:00Z" };
const ASSIGN_005_V3: GeneratedAssignment = { ...ASSIGN_005_V1, id: "assign-005-v3", createdAt: "2026-02-08T10:30:00Z" };
const ASSIGN_005: GeneratedAssignment = { ...ASSIGN_005_V1, id: "assign-005", createdAt: "2026-02-08T10:45:00Z" };

// ===== assign-006: Failed hard check (concept containment) =====
const ASSIGN_006: GeneratedAssignment = {
  id: "assign-006",
  request: {
    categoryId: "dsa",
    classContextId: "ctx-arrays-and-hashing",
    targetConcepts: { primary: ["hashmaps"], secondary: ["arrays"], mustNotRequire: ["dynamic_programming_2d", "graphs"] },
    difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
    assignmentType: "coding_problem",
    realWorldAnchor: { domain: "search", avoidOverused: [] },
    corpusSliceIds: ["q-two-sum"]
  },
  problem: {
    title: "Edit Distance Between Search Queries (CONCEPT VIOLATION)",
    statement: `Given two search query strings, compute the edit distance (minimum insertions, deletions, or substitutions to transform one into the other).\n\nNote: This problem INCORRECTLY requires dynamic_programming_2d which is not in the class context.`,
    inputFormat: "Two lines: source and target string.",
    outputFormat: "Integer: edit distance.",
    constraints: ["0 ≤ len ≤ 500"],
    examples: [
      { input: "search\nresearch", output: "2", explanation: "Insert r and e." }
    ]
  },
  starterCode: [{ language: "python", code: `def edit_distance(s: str, t: str) -> int:\n    pass` }],
  referenceSolution: {
    language: "python",
    code: `def edit_distance(s, t):\n    m, n = len(s), len(t)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1]\n            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]`,
    complexityTime: "O(m × n)",
    complexitySpace: "O(m × n)"
  },
  bruteForceSolution: undefined,
  testCases: [
    { id: "tc1", input: "search\nresearch", expectedOutput: "2", visibility: "sample", rationale: "Insert r and e." },
    { id: "tc2", input: "abc\nabc", expectedOutput: "0", visibility: "sample", rationale: "Identical." }
  ],
  rubric: {
    evaluationDimensions: [{
      dimension: "2D DP edit distance",
      weight: 1.0,
      anchors: { 5: "Correct 2D DP.", 3: "Partial.", 1: "Wrong." },
      evidenceRequired: "2D DP array"
    }],
    conceptsBeingAssessed: ["dynamic_programming_2d"],
    redFlags: ["this problem requires 2D DP which was NOT in scope for this class context"]
  },
  metadata: {
    conceptsRequired: ["dynamic_programming_2d"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.65,
    estimatedSolveTimeMinutes: 40,
    realWorldDomain: "search",
    noveltyHash: "h-edit-search-006",
    sourceInspirations: []
  },
  reasoningTrace: {
    conceptSelectionRationale: "Edit distance demonstrates 2D DP but requires concepts not in scope for this class context — this represents a concept containment violation.",
    scenarioSelectionRationale: "Search query similarity is a real use case but requires out-of-scope concepts.",
    difficultyCalibrationRationale: "Hard: 2D DP is advanced but was introduced in a later module.",
    deviationsFromCorpus: "No corpus match; conceptually independent."
  },
  versions: PIPELINE_VERSIONS,
  createdAt: "2026-02-10T10:00:00Z"
};

// ===== Verification and Eval runs =====

const VER_001 = makeVerification("ver-001", "assign-001", true);
const EVAL_001 = makeEvalRun("eval-001", "assign-001", { problem_clarity: 4.5, test_case_coverage: 4.0, complexity_correctness: 4.5, concept_rubric_alignment: 4.5, real_world_fidelity: 4.0, novelty: 3.5 }, true);

const VER_002_V1 = makeVerification("ver-002-v1", "assign-002-v1", true);
const EVAL_002_V1 = makeEvalRun("eval-002-v1", "assign-002-v1", { problem_clarity: 4.0, test_case_coverage: 3.5, complexity_correctness: 4.0, concept_rubric_alignment: 1.8, real_world_fidelity: 3.5, novelty: 3.5 }, false);
const VER_002 = makeVerification("ver-002", "assign-002", true);
const EVAL_002 = makeEvalRun("eval-002", "assign-002", { problem_clarity: 4.0, test_case_coverage: 4.0, complexity_correctness: 4.0, concept_rubric_alignment: 3.8, real_world_fidelity: 3.5, novelty: 3.5 }, true);

const VER_003 = makeVerification("ver-003", "assign-003", true);
const EVAL_003 = makeEvalRun("eval-003", "assign-003", { problem_clarity: 4.5, test_case_coverage: 4.0, complexity_correctness: 4.5, concept_rubric_alignment: 4.0, real_world_fidelity: 4.0, novelty: 4.0 }, true);

const VER_004 = makeVerification("ver-004", "assign-004", true);
const EVAL_004 = makeEvalRun("eval-004", "assign-004", { problem_clarity: 4.0, test_case_coverage: 3.5, complexity_correctness: 4.5, concept_rubric_alignment: 4.5, real_world_fidelity: 3.5, novelty: 4.0 }, true);

const VER_005_V1 = makeVerification("ver-005-v1", "assign-005-v1", true);
const EVAL_005_V1 = makeEvalRun("eval-005-v1", "assign-005-v1", { problem_clarity: 2.5, test_case_coverage: 2.0, complexity_correctness: 2.5, concept_rubric_alignment: 1.5, real_world_fidelity: 2.5, novelty: 2.0 }, false);
const VER_005_V2 = makeVerification("ver-005-v2", "assign-005-v2", true);
const EVAL_005_V2 = makeEvalRun("eval-005-v2", "assign-005-v2", { problem_clarity: 2.8, test_case_coverage: 2.3, complexity_correctness: 2.8, concept_rubric_alignment: 2.0, real_world_fidelity: 2.8, novelty: 2.2 }, false);
const VER_005_V3 = makeVerification("ver-005-v3", "assign-005-v3", true);
const EVAL_005_V3 = makeEvalRun("eval-005-v3", "assign-005-v3", { problem_clarity: 3.0, test_case_coverage: 2.5, complexity_correctness: 3.0, concept_rubric_alignment: 2.2, real_world_fidelity: 3.0, novelty: 2.4 }, false);

const VER_006 = makeVerification("ver-006", "assign-006", false, {
  conceptContainment: { passed: false, outOfScope: ["dynamic_programming_2d"] },
  codeExecution: { passed: true, results: [{ testCaseId: "tc1", passed: true, runtimeMs: 45 }] }
});
const EVAL_006 = makeEvalRun("eval-006", "assign-006", { problem_clarity: 3.0, test_case_coverage: 2.0, complexity_correctness: 4.0, concept_rubric_alignment: 2.0, real_world_fidelity: 3.0, novelty: 3.0 }, false);

export const DSA_ASSIGNMENTS: AssignmentRecord[] = [
  {
    assignment: ASSIGN_001,
    verificationRuns: [VER_001],
    evalRuns: [EVAL_001],
    refinementIterations: [],
    instructorReview: {
      id: "review-001",
      assignmentId: "assign-001",
      reviewer: "Sarah Chen",
      status: "approved",
      ratings: [
        { dimension: "problem_clarity", score: 5 },
        { dimension: "test_case_coverage", score: 4 },
        { dimension: "concept_rubric_alignment", score: 5 },
        { dimension: "real_world_fidelity", score: 4 },
        { dimension: "novelty", score: 4 }
      ],
      comments: "Clean problem statement, good tie-breaking requirement. Nicely grounds the abstract concept in observability.",
      reviewedAt: "2026-02-01T14:00:00Z"
    },
    status: "approved"
  },
  {
    assignment: ASSIGN_002_V2,
    verificationRuns: [VER_002_V1, VER_002],
    evalRuns: [EVAL_002_V1, EVAL_002],
    refinementIterations: [
      {
        iteration: 1,
        triggeredBy: "soft_score_fail",
        failureSignal: "rubric_misaligned",
        outputId: "assign-002",
        scoreImprovement: 2.0
      }
    ],
    instructorReview: {
      id: "review-002",
      assignmentId: "assign-002",
      reviewer: "Sarah Chen",
      status: "approved",
      ratings: [
        { dimension: "problem_clarity", score: 4 },
        { dimension: "concept_rubric_alignment", score: 4 }
      ],
      comments: "The refinement fixed the rubric alignment. Sliding window problem is well-calibrated.",
      reviewedAt: "2026-02-03T15:00:00Z"
    },
    allIterationAssignments: [ASSIGN_002_V1, ASSIGN_002_V2],
    status: "approved"
  },
  {
    assignment: ASSIGN_003,
    verificationRuns: [VER_003],
    evalRuns: [EVAL_003],
    refinementIterations: [],
    status: "awaiting_approval"
  },
  {
    assignment: ASSIGN_004,
    verificationRuns: [VER_004],
    evalRuns: [EVAL_004],
    refinementIterations: [],
    instructorReview: {
      id: "review-004",
      assignmentId: "assign-004",
      reviewer: "Sarah Chen",
      status: "rejected",
      ratings: [
        { dimension: "real_world_fidelity", score: 2 },
        { dimension: "novelty", score: 2 }
      ],
      comments: "The auction framing feels contrived — bids don't work sequentially like this in real systems. Also this is too similar to daily temperatures. Need a more grounded scenario.",
      reviewedAt: "2026-02-07T16:00:00Z"
    },
    status: "rejected"
  },
  {
    assignment: ASSIGN_005,
    verificationRuns: [VER_005_V1, VER_005_V2, VER_005_V3],
    evalRuns: [EVAL_005_V1, EVAL_005_V2, EVAL_005_V3],
    refinementIterations: [
      { iteration: 1, triggeredBy: "soft_score_fail", failureSignal: "low_composite_score", outputId: "assign-005-v2", scoreImprovement: 0.4 },
      { iteration: 2, triggeredBy: "soft_score_fail", failureSignal: "rubric_misaligned", outputId: "assign-005-v3", scoreImprovement: 0.3 },
      { iteration: 3, triggeredBy: "soft_score_fail", failureSignal: "clarity_insufficient", outputId: "assign-005", scoreImprovement: 0.2 }
    ],
    allIterationAssignments: [ASSIGN_005_V1, ASSIGN_005_V2, ASSIGN_005_V3, ASSIGN_005],
    status: "failed_eval"
  },
  {
    assignment: ASSIGN_006,
    verificationRuns: [VER_006],
    evalRuns: [EVAL_006],
    refinementIterations: [],
    status: "failed_hard_check"
  }
];
