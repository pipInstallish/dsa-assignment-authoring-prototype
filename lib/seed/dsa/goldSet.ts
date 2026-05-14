import type { GoldSetEntry, GeneratedAssignment } from "../../types";

const GOLD_VERSIONS = {
  pipelineVersion: "manual:gold-set:1.0",
  promptVersion: "manual",
  judgeVersion: "manual",
  taxonomyVersion: 1,
  goldSetVersion: 1
};

const RATINGS_HIGH = [
  {
    rater: "user-instructor-1",
    perDimension: {
      problem_clarity: 5,
      test_case_coverage: 5,
      complexity_correctness: 5,
      concept_rubric_alignment: 5,
      real_world_fidelity: 4,
      novelty: 4
    },
    overallComment: "Strong exemplar — clear, well-covered, realistic framing."
  }
];

const GOLD_001_OUTPUT: GeneratedAssignment = {
  id: "gold-001-output",
  request: null as any,
  problem: {
    title: "First Recurring Error Code in a Service Log",
    statement: `A production service emits a stream of integer error codes during a deploy window. The on-call engineer needs to know the **first error code that recurs** so that root-cause analysis can begin with the right signal.\n\nGiven an array \`error_codes\` representing the chronologically ordered stream of error codes, return the first error code that appears more than once. If no error code recurs, return \`-1\`.\n\n"First recurring" means: the error code whose **second occurrence** has the smallest index in the array.`,
    inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Second line: n space-separated integers, each in [-10^9, 10^9], representing error codes in chronological order.",
    outputFormat: "A single integer: the first recurring error code, or -1 if none.",
    constraints: [
      "1 ≤ n ≤ 100,000",
      "Each error code fits in a 32-bit signed integer",
      "Time limit: 2 seconds",
      "Memory limit: 256 MB"
    ],
    examples: [
      {
        input: "7\n400 503 404 503 400 502 404",
        output: "503",
        explanation: "The codes that recur are 503 (second occurrence at index 3), 400 (at index 4), and 404 (at index 6). The earliest second-occurrence is 503's, at index 3."
      },
      {
        input: "5\n100 200 300 400 500",
        output: "-1",
        explanation: "No code repeats."
      }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def first_recurring_error(error_codes: list[int]) -> int:
    # Your implementation here
    pass

if __name__ == "__main__":
    n = int(input())
    codes = list(map(int, input().split()))
    print(first_recurring_error(codes))`
  }],
  referenceSolution: {
    language: "python",
    code: `def first_recurring_error(error_codes: list[int]) -> int:
    seen = set()
    for code in error_codes:
        if code in seen:
            return code
        seen.add(code)
    return -1

if __name__ == "__main__":
    n = int(input())
    codes = list(map(int, input().split()))
    print(first_recurring_error(codes))`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def first_recurring_error(error_codes):
    for i in range(len(error_codes)):
        for j in range(i):
            if error_codes[j] == error_codes[i]:
                return error_codes[i]
    return -1`
  },
  testCases: [
    { id: "tc1", input: "7\n400 503 404 503 400 502 404", expectedOutput: "503", visibility: "sample", rationale: "Standard case with multiple recurrences." },
    { id: "tc2", input: "5\n100 200 300 400 500", expectedOutput: "-1", visibility: "sample", rationale: "No recurrence — must return -1." },
    { id: "tc3", input: "1\n42", expectedOutput: "-1", visibility: "hidden", rationale: "Single element — cannot recur." },
    { id: "tc4", input: "2\n7 7", expectedOutput: "7", visibility: "hidden", rationale: "Minimal recurrence at indices 0,1." },
    { id: "tc5", input: "6\n-1 -2 -1 -2 0 0", expectedOutput: "-1", visibility: "hidden", rationale: "Negative codes; correct answer requires negative-key handling." },
    { id: "tc6", input: "4\n0 1 2 0", expectedOutput: "0", visibility: "hidden", rationale: "Recurrence at last position." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct use of hashmap/hashset for O(1) lookup",
        weight: 0.4,
        anchors: {
          5: "Uses a set or dict for O(1) membership; returns on first hit; correctly handles negative and zero values.",
          3: "Uses a hashmap but with an O(n) operation inside the loop, degrading to O(n²); or correct on positives but mishandles negatives.",
          1: "Does not use a hashmap; relies on linear scan or sorting, missing the point of the exercise."
        },
        evidenceRequired: "Solution code includes set/dict usage in single-pass loop"
      },
      {
        dimension: "Correct interpretation of 'first recurring'",
        weight: 0.3,
        anchors: {
          5: "Returns the element whose second occurrence is earliest; verified against examples.",
          3: "Slight misinterpretation (e.g., returns most-frequent or first duplicate-pair) but algorithm is otherwise sound.",
          1: "Misreads the problem; returns wrong semantic element."
        },
        evidenceRequired: "Returns on first 'already seen' hit during forward iteration"
      },
      {
        dimension: "Edge case handling",
        weight: 0.2,
        anchors: {
          5: "Returns -1 for no recurrence; correctly handles single-element, all-same, and negatives.",
          3: "Handles main cases but fails on one of: empty/single, all-negative, or all-same.",
          1: "Crashes or returns wrong value on multiple edge cases."
        },
        evidenceRequired: "Passes hidden test cases tc3, tc4, tc5"
      },
      {
        dimension: "Complexity awareness",
        weight: 0.1,
        anchors: {
          5: "Solution is O(n) time and O(n) space; learner can explain why.",
          3: "Solution is O(n) but learner cannot justify space cost.",
          1: "Solution is O(n²) or worse."
        },
        evidenceRequired: "Solution passes tc6 (large input) within time limit"
      }
    ],
    conceptsBeingAssessed: ["hashmaps", "frequency_counting"],
    redFlags: ["uses nested loops with no hashmap", "sorts the input", "uses Counter and looks at counts (misinterprets 'first')"]
  },
  metadata: {
    conceptsRequired: ["hashmaps", "frequency_counting", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.35,
    estimatedSolveTimeMinutes: 25,
    realWorldDomain: "observability",
    noveltyHash: "h-recur-err-001a",
    sourceInspirations: [{ corpusId: "q-two-sum", similarity: 0.32 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Targets hashmap + frequency tracking as primary; the 'first recurring' twist forces single-pass with set rather than full Counter, exercising the lookup-while-iterating idiom.",
    scenarioSelectionRationale: "Observability/log analysis is a recognizable engineering scenario; integers as error codes ground the abstract array naturally.",
    difficultyCalibrationRationale: "Single-concept primary with a small semantic twist keeps this at medium-easy; appropriate as first hands-on assignment after the hash-lookup module.",
    deviationsFromCorpus: "Inspired by Two Sum's hash-lookup pattern but the 'first to recur' semantics is materially different from sum-based queries."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T11:00:00Z"
};

const GOLD_002_OUTPUT: GeneratedAssignment = {
  id: "gold-002-output",
  request: null as any,
  problem: {
    title: "Pair of Packages Closest to Truck Capacity",
    statement: `A delivery truck has a fixed weight capacity \`C\`. A warehouse maintains a list of package weights, and the dispatcher wants to load exactly two packages whose combined weight is as close to \`C\` as possible **without exceeding it**.\n\nGiven an array \`weights\` of package weights and the truck capacity \`C\`, return the maximum combined weight of any two distinct packages that is ≤ \`C\`. If no such pair exists, return \`-1\`.`,
    inputFormat: "First line: integers n and C (2 ≤ n ≤ 10^5; 1 ≤ C ≤ 10^9). Second line: n space-separated integers.",
    outputFormat: "A single integer: the max combined weight ≤ C, or -1.",
    constraints: ["2 ≤ n ≤ 100,000", "1 ≤ C ≤ 10^9", "1 ≤ weight_i ≤ 10^9", "Time limit: 2 seconds"],
    examples: [
      { input: "5 50\n10 20 30 40 25", output: "50", explanation: "20 + 30 = 50, exactly capacity." },
      { input: "4 10\n7 8 9 11", output: "-1", explanation: "Minimum pair sum is 7+8=15, which exceeds 10." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def closest_pair_weight(weights: list[int], capacity: int) -> int:
    pass

if __name__ == "__main__":
    n, C = map(int, input().split())
    w = list(map(int, input().split()))
    print(closest_pair_weight(w, C))`
  }],
  referenceSolution: {
    language: "python",
    code: `def closest_pair_weight(weights, capacity):
    weights = sorted(weights)
    left, right = 0, len(weights) - 1
    best = -1
    while left < right:
        s = weights[left] + weights[right]
        if s <= capacity:
            if s > best:
                best = s
            left += 1
        else:
            right -= 1
    return best

if __name__ == "__main__":
    n, C = map(int, input().split())
    w = list(map(int, input().split()))
    print(closest_pair_weight(w, C))`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(1) extra (in-place sort) or O(n) if sort copies"
  },
  bruteForceSolution: {
    language: "python",
    code: `def closest_pair_weight(weights, capacity):
    best = -1
    for i in range(len(weights)):
        for j in range(i+1, len(weights)):
            s = weights[i] + weights[j]
            if s <= capacity and s > best:
                best = s
    return best`
  },
  testCases: [
    { id: "tc1", input: "5 50\n10 20 30 40 25", expectedOutput: "50", visibility: "sample", rationale: "Exact-match pair exists." },
    { id: "tc2", input: "4 10\n7 8 9 11", expectedOutput: "-1", visibility: "sample", rationale: "No pair within capacity." },
    { id: "tc3", input: "2 100\n40 60", expectedOutput: "100", visibility: "hidden", rationale: "Minimum size n=2; pair is exactly capacity." },
    { id: "tc4", input: "2 10\n40 60", expectedOutput: "-1", visibility: "hidden", rationale: "n=2, no valid pair." },
    { id: "tc5", input: "6 100\n50 50 50 50 50 50", expectedOutput: "100", visibility: "hidden", rationale: "Duplicates — must use two distinct indices." },
    { id: "tc6", input: "5 200\n1 2 3 4 5", expectedOutput: "9", visibility: "hidden", rationale: "All pairs within capacity; largest is 4+5=9." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Two-pointer technique applied to sorted array",
        weight: 0.5,
        anchors: {
          5: "Sorts the array, uses left/right pointers moving inward based on sum-vs-capacity comparison. Achieves O(n log n).",
          3: "Uses two pointers but misses the sort prerequisite OR the wrong pointer-move logic forces re-checks.",
          1: "Does not use two pointers; uses brute force nested loops."
        },
        evidenceRequired: "Solution sorts then performs single linear pass with two indices"
      },
      {
        dimension: "Correct distinct-index constraint",
        weight: 0.2,
        anchors: {
          5: "Pointer condition is left < right; never uses the same index twice.",
          3: "Handles distinctness in most cases but has off-by-one or loop-bound issue.",
          1: "Permits same-index pair."
        },
        evidenceRequired: "Loop condition strictly enforces left < right"
      },
      {
        dimension: "Edge case handling",
        weight: 0.2,
        anchors: {
          5: "Returns -1 when no valid pair; minimum n=2 works; duplicates handled.",
          3: "Handles most edges but mishandles n=2 boundary or duplicates.",
          1: "Crashes or returns wrong value on multiple edges."
        },
        evidenceRequired: "Passes tc3, tc4, tc5"
      },
      {
        dimension: "Complexity",
        weight: 0.1,
        anchors: {
          5: "O(n log n) achieved and learner can articulate why.",
          3: "O(n log n) achieved but justification weak.",
          1: "O(n²) or worse."
        },
        evidenceRequired: "Passes tc6 within time limit"
      }
    ],
    conceptsBeingAssessed: ["two_pointers", "sorting"],
    redFlags: ["does not sort", "uses three nested loops", "uses hashmap and misses the two-pointer pattern"]
  },
  metadata: {
    conceptsRequired: ["two_pointers", "sorting", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.45,
    estimatedSolveTimeMinutes: 35,
    realWorldDomain: "logistics",
    noveltyHash: "h-pair-cap-002",
    sourceInspirations: [{ corpusId: "q-three-sum", similarity: 0.4 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Two-pointer on sorted array is the target idiom; truck-capacity framing forces the bounded-sum variant rather than exact-target.",
    scenarioSelectionRationale: "Logistics is widely recognizable; weight-and-capacity removes the contrivance of pure arithmetic.",
    difficultyCalibrationRationale: "Medium: sort prerequisite + correct pointer-move logic + distinctness constraint. Within 35 minutes for a learner who's seen the technique.",
    deviationsFromCorpus: "Inspired by 3Sum (two-pointer on sorted) but constrained to pairs and bounded by capacity rather than exact-zero."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T11:30:00Z"
};

const GOLD_003_OUTPUT: GeneratedAssignment = {
  id: "gold-003-output",
  request: null as any,
  problem: {
    title: "Peak Sustained Request Rate",
    statement: `A reverse proxy emits a per-second log of request counts. The infra team wants to know: **what is the highest sustained average request rate over any contiguous K-second window?**\n\nGiven an array \`rates\` of length n where \`rates[i]\` is requests-per-second at second \`i\`, and an integer \`K\`, return the maximum average over any contiguous window of length exactly K. Output as a single decimal with five places of precision.`,
    inputFormat: "First line: integers n and K (1 ≤ K ≤ n ≤ 10^5). Second line: n space-separated integers, each in [0, 10^6].",
    outputFormat: "A single decimal number with exactly 5 decimal places.",
    constraints: ["1 ≤ K ≤ n ≤ 100,000", "0 ≤ rates[i] ≤ 10^6", "Time limit: 2 seconds"],
    examples: [
      { input: "5 3\n10 20 30 40 50", output: "40.00000", explanation: "Window [30,40,50] has the highest avg = 40." },
      { input: "4 2\n5 5 5 5", output: "5.00000", explanation: "All windows have avg 5." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def peak_sustained_rate(rates: list[int], k: int) -> float:
    pass

if __name__ == "__main__":
    n, k = map(int, input().split())
    r = list(map(int, input().split()))
    print(f"{peak_sustained_rate(r, k):.5f}")`
  }],
  referenceSolution: {
    language: "python",
    code: `def peak_sustained_rate(rates, k):
    window_sum = sum(rates[:k])
    best = window_sum
    for i in range(k, len(rates)):
        window_sum += rates[i] - rates[i - k]
        if window_sum > best:
            best = window_sum
    return best / k

if __name__ == "__main__":
    n, k = map(int, input().split())
    r = list(map(int, input().split()))
    print(f"{peak_sustained_rate(r, k):.5f}")`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def peak_sustained_rate(rates, k):
    best = sum(rates[:k])
    for i in range(len(rates) - k + 1):
        s = sum(rates[i:i+k])
        if s > best:
            best = s
    return best / k`
  },
  testCases: [
    { id: "tc1", input: "5 3\n10 20 30 40 50", expectedOutput: "40.00000", visibility: "sample", rationale: "Standard window." },
    { id: "tc2", input: "4 2\n5 5 5 5", expectedOutput: "5.00000", visibility: "sample", rationale: "Uniform values." },
    { id: "tc3", input: "1 1\n42", expectedOutput: "42.00000", visibility: "hidden", rationale: "Minimum n=k=1." },
    { id: "tc4", input: "5 5\n1 2 3 4 5", expectedOutput: "3.00000", visibility: "hidden", rationale: "Window equals array length." },
    { id: "tc5", input: "6 2\n0 0 0 1000000 0 0", expectedOutput: "500000.00000", visibility: "hidden", rationale: "Spike value; tests sliding subtraction precision." },
    { id: "tc6", input: "6 3\n3 3 3 3 3 3", expectedOutput: "3.00000", visibility: "hidden", rationale: "All equal values." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Sliding window with O(1) update",
        weight: 0.5,
        anchors: {
          5: "Maintains running sum, adds new element, subtracts old element on each step. O(n) overall.",
          3: "Uses sliding window concept but recomputes sum from scratch each window (O(n*k)).",
          1: "No sliding window; uses prefix sums or worse approaches."
        },
        evidenceRequired: "Loop body has constant-work update of window_sum"
      },
      {
        dimension: "Correct window boundaries",
        weight: 0.2,
        anchors: {
          5: "Window of exactly k consecutive elements throughout; boundary cases (n=k, k=1) correct.",
          3: "Off-by-one in initial window or final iteration.",
          1: "Wrong window size or skips end of array."
        },
        evidenceRequired: "Passes tc3 (k=1), tc4 (k=n)"
      },
      {
        dimension: "Numerical output formatting",
        weight: 0.1,
        anchors: {
          5: "Exactly 5 decimal places; uses division-by-k at the end.",
          3: "Correct value but wrong format.",
          1: "Wrong value due to integer division or premature rounding."
        },
        evidenceRequired: "Output matches expected format exactly"
      },
      {
        dimension: "Complexity",
        weight: 0.2,
        anchors: {
          5: "O(n) time, O(1) extra space.",
          3: "O(n*k) — passes small cases but may time out.",
          1: "O(n²) or worse."
        },
        evidenceRequired: "Passes tc6 within time limit"
      }
    ],
    conceptsBeingAssessed: ["sliding_window"],
    redFlags: ["recomputes window sum each iteration", "uses sort", "uses heap"]
  },
  metadata: {
    conceptsRequired: ["sliding_window", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.4,
    estimatedSolveTimeMinutes: 30,
    realWorldDomain: "infrastructure",
    noveltyHash: "h-peak-rate-003",
    sourceInspirations: [{ corpusId: "q-longest-unique-substring", similarity: 0.28 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Sliding window with running-sum maintenance is the target. Fixed-size variant is the entry-level form of the technique.",
    scenarioSelectionRationale: "Per-second metrics and autoscaling are real-world infra problems; ties the abstract window to a recognizable signal.",
    difficultyCalibrationRationale: "Medium: technique is conceptually simple but requires correct O(1) update — common mistake is recomputing.",
    deviationsFromCorpus: "Longest-substring-without-repeats is variable-size with hashmap state; this is fixed-size pure sum, a different sub-pattern."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T12:00:00Z"
};

const GOLD_004_OUTPUT: GeneratedAssignment = {
  id: "gold-004-output",
  request: null as any,
  problem: {
    title: "Maximum Revenue from Non-Adjacent Ad Slots",
    statement: `An ad network sells slots in a sequence of TV breaks. To prevent ad fatigue, the system enforces that **no two adjacent breaks** can be sold to the same campaign. Given an array \`revenue\` where \`revenue[i]\` is the revenue from selling slot \`i\` to your campaign, choose a subset of slots with **no two adjacent** that **maximizes total revenue**.\n\nReturn the maximum total revenue achievable.`,
    inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Second line: n space-separated integers, each in [0, 10^6].",
    outputFormat: "A single integer: maximum revenue.",
    constraints: ["1 ≤ n ≤ 100,000", "0 ≤ revenue[i] ≤ 10^6"],
    examples: [
      { input: "5\n3 2 7 10 1", output: "13", explanation: "Choose slots 0, 3 → 3+10=13." },
      { input: "4\n5 5 5 5", output: "10", explanation: "Pick alternating: 5+5=10." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def max_non_adjacent_revenue(revenue: list[int]) -> int:
    pass

if __name__ == "__main__":
    n = int(input())
    r = list(map(int, input().split()))
    print(max_non_adjacent_revenue(r))`
  }],
  referenceSolution: {
    language: "python",
    code: `def max_non_adjacent_revenue(revenue):
    if not revenue:
        return 0
    if len(revenue) == 1:
        return revenue[0]
    prev2 = 0
    prev1 = 0
    for r in revenue:
        cur = max(prev1, prev2 + r)
        prev2 = prev1
        prev1 = cur
    return prev1

if __name__ == "__main__":
    n = int(input())
    r = list(map(int, input().split()))
    print(max_non_adjacent_revenue(r))`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def max_non_adjacent_revenue(revenue):
    def rec(i):
        if i >= len(revenue): return 0
        return max(rec(i+1), revenue[i] + rec(i+2))
    return rec(0)`
  },
  testCases: [
    { id: "tc1", input: "5\n3 2 7 10 1", expectedOutput: "13", visibility: "sample", rationale: "Standard case." },
    { id: "tc2", input: "4\n5 5 5 5", expectedOutput: "10", visibility: "sample", rationale: "Uniform values." },
    { id: "tc3", input: "1\n42", expectedOutput: "42", visibility: "hidden", rationale: "Single element." },
    { id: "tc4", input: "3\n0 0 0", expectedOutput: "0", visibility: "hidden", rationale: "All zeros." },
    { id: "tc5", input: "2\n5 10", expectedOutput: "10", visibility: "hidden", rationale: "Pick the larger of two adjacent." },
    { id: "tc6", input: "4\n1 2 3 4", expectedOutput: "6", visibility: "hidden", rationale: "Non-adjacent: 2+4=6 or 1+3+?... Best is 2+4=6." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct DP recurrence",
        weight: 0.5,
        anchors: {
          5: "Defines f(i) = max(f(i-1), f(i-2) + revenue[i]) and implements it correctly bottom-up.",
          3: "Recurrence correct but implementation has off-by-one or wrong base case.",
          1: "Recurrence wrong (e.g., uses f(i-1) + revenue[i], breaking non-adjacency)."
        },
        evidenceRequired: "Loop computes each value from previous two"
      },
      {
        dimension: "Space optimization",
        weight: 0.2,
        anchors: {
          5: "Uses two scalar variables, O(1) space.",
          3: "Uses an O(n) array; works correctly but doesn't optimize.",
          1: "Uses memoized recursion with stack overflow risk on n=10^5."
        },
        evidenceRequired: "No DP array allocation OR justified O(n) array"
      },
      {
        dimension: "Edge cases",
        weight: 0.2,
        anchors: {
          5: "Handles n=1, n=2, all-zeros correctly.",
          3: "One edge fails.",
          1: "Multiple edges fail."
        },
        evidenceRequired: "Passes tc3, tc4, tc5"
      },
      {
        dimension: "Complexity",
        weight: 0.1,
        anchors: {
          5: "O(n) time, O(1) space, passes tc6.",
          3: "O(n) time, O(n) space.",
          1: "Exponential / TLE on tc6."
        },
        evidenceRequired: "Passes tc6 within time limit"
      }
    ],
    conceptsBeingAssessed: ["dynamic_programming_1d"],
    redFlags: ["uses exponential recursion without memoization", "off-by-one in base case", "treats this as greedy / picks every other element naively"]
  },
  metadata: {
    conceptsRequired: ["dynamic_programming_1d", "arrays"],
    conceptsOptional: ["recursion"],
    estimatedDifficultyScore: 0.55,
    estimatedSolveTimeMinutes: 40,
    realWorldDomain: "advertising",
    noveltyHash: "h-ad-rev-004",
    sourceInspirations: [{ corpusId: "q-coin-change", similarity: 0.35 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Classic 1D DP with two-state recurrence; the ad-slot framing emphasizes the non-adjacency constraint naturally.",
    scenarioSelectionRationale: "Ad-fatigue rules are a real engineering constraint in ad-tech; common to model as integer programming.",
    difficultyCalibrationRationale: "Medium-high: requires recognizing DP pattern and correctly handling adjacency.",
    deviationsFromCorpus: "Coin Change is 1D DP but the recurrence is different (unbounded selection vs. adjacency constraint)."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T12:30:00Z"
};

const GOLD_005_OUTPUT: GeneratedAssignment = {
  id: "gold-005-output",
  request: null as any,
  problem: {
    title: "Sum of Product Prices in a Range",
    statement: `A pricing service stores product prices in a binary search tree keyed by price. Given the **root** of a BST and a price range \`[lo, hi]\` (inclusive), return the sum of all prices that fall within the range.\n\nUse the BST property to prune your traversal — do not visit every node.`,
    inputFormat: "First line: integers n, lo, hi. Next n lines: each 'val left_idx right_idx'.",
    outputFormat: "A single integer: sum of values in [lo, hi].",
    constraints: ["1 ≤ n ≤ 100,000", "Tree is a valid BST", "Time: 2 seconds"],
    examples: [
      {
        input: "5 7 15\n10 1 2\n5 3 -1\n15 4 -1\n3 -1 -1\n12 -1 -1",
        output: "37",
        explanation: "Values in [7,15] are 10, 12, 15 → sum 37."
      },
      {
        input: "1 0 100\n50 -1 -1",
        output: "50",
        explanation: "Single node within range."
      }
    ]
  },
  starterCode: [{
    language: "python",
    code: `import sys
sys.setrecursionlimit(200000)

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def range_sum(root, lo, hi):
    pass

if __name__ == "__main__":
    n, lo, hi = map(int, input().split())
    rows = [tuple(map(int, input().split())) for _ in range(n)]
    # Build tree and call range_sum`
  }],
  referenceSolution: {
    language: "python",
    code: `import sys
sys.setrecursionlimit(200000)

class Node:
    def __init__(self, val):
        self.val = val; self.left = None; self.right = None

def build(rows):
    nodes = [Node(r[0]) for r in rows]
    for i, (_, l, r) in enumerate(rows):
        if l != -1: nodes[i].left = nodes[l]
        if r != -1: nodes[i].right = nodes[r]
    return nodes[0]

def range_sum(root, lo, hi):
    if root is None:
        return 0
    if root.val < lo:
        return range_sum(root.right, lo, hi)
    if root.val > hi:
        return range_sum(root.left, lo, hi)
    return root.val + range_sum(root.left, lo, hi) + range_sum(root.right, lo, hi)

if __name__ == "__main__":
    n, lo, hi = map(int, input().split())
    rows = [tuple(map(int, input().split())) for _ in range(n)]
    print(range_sum(build(rows), lo, hi))`,
    complexityTime: "O(n) worst case, O(log n + k) for balanced BST",
    complexitySpace: "O(h) recursion depth where h is tree height"
  },
  bruteForceSolution: {
    language: "python",
    code: `def range_sum(root, lo, hi):
    if root is None: return 0
    s = root.val if lo <= root.val <= hi else 0
    return s + range_sum(root.left, lo, hi) + range_sum(root.right, lo, hi)`
  },
  testCases: [
    { id: "tc1", input: "5 7 15\n10 1 2\n5 3 -1\n15 4 -1\n3 -1 -1\n12 -1 -1", expectedOutput: "37", visibility: "sample", rationale: "Standard range." },
    { id: "tc2", input: "1 0 100\n50 -1 -1", expectedOutput: "50", visibility: "sample", rationale: "Single node." },
    { id: "tc3", input: "1 0 10\n50 -1 -1", expectedOutput: "0", visibility: "hidden", rationale: "Node out of range." },
    { id: "tc4", input: "3 10 20\n15 1 2\n10 -1 -1\n20 -1 -1", expectedOutput: "45", visibility: "hidden", rationale: "All three in range." },
    { id: "tc5", input: "5 -5 5\n0 1 2\n-3 3 -1\n3 -1 4\n-7 -1 -1\n7 -1 -1", expectedOutput: "0", visibility: "hidden", rationale: "Negative values and zero." },
    { id: "tc6", input: "3 5 5\n5 1 2\n3 -1 -1\n7 -1 -1", expectedOutput: "5", visibility: "hidden", rationale: "Single match; pruning should skip both subtrees after match." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct DFS with BST pruning",
        weight: 0.5,
        anchors: {
          5: "Recurses into left only when current value > lo; right only when current value < hi. Includes current if in range.",
          3: "Visits all nodes (no pruning) but otherwise correct.",
          1: "Wrong traversal logic or fails to handle BST property."
        },
        evidenceRequired: "Solution code shows conditional left/right recursion"
      },
      {
        dimension: "Range inclusion logic",
        weight: 0.2,
        anchors: {
          5: "Includes endpoints (lo and hi inclusive); handles negative and zero.",
          3: "One boundary off (e.g., strict inequality on one side).",
          1: "Wrong comparison operators throughout."
        },
        evidenceRequired: "Passes tc3, tc5"
      },
      {
        dimension: "Tree handling and recursion",
        weight: 0.2,
        anchors: {
          5: "Handles null nodes; recursion depth managed via setrecursionlimit when needed.",
          3: "Crashes on deeply skewed trees (recursion limit).",
          1: "Mishandles null children."
        },
        evidenceRequired: "Passes tc6"
      },
      {
        dimension: "BST property utilization",
        weight: 0.1,
        anchors: {
          5: "Articulates that pruning reduces work; correctly uses ordering.",
          3: "Pruning works but learner cannot articulate why.",
          1: "No use of BST property."
        },
        evidenceRequired: "Comments or reasoning trace shows BST awareness"
      }
    ],
    conceptsBeingAssessed: ["tree_traversal_dfs", "binary_search_tree"],
    redFlags: ["uses BFS / level-order (misses BST pruning opportunity)", "doesn't recurse — uses parent pointers"]
  },
  metadata: {
    conceptsRequired: ["tree_traversal_dfs", "binary_search_tree", "recursion"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.5,
    estimatedSolveTimeMinutes: 35,
    realWorldDomain: "pricing",
    noveltyHash: "h-bst-range-005",
    sourceInspirations: [{ corpusId: "q-binary-tree-inorder", similarity: 0.3 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Range-sum-of-BST forces the learner to combine recursive DFS with BST pruning — the integration is the point.",
    scenarioSelectionRationale: "Pricing systems are a recognizable engineering domain; sum-by-range queries are bread-and-butter analytics.",
    difficultyCalibrationRationale: "Medium: traversal is standard, pruning is the discriminator.",
    deviationsFromCorpus: "Inorder traversal is unconditional; this problem requires conditional pruning."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T13:00:00Z"
};

const GOLD_006_OUTPUT: GeneratedAssignment = {
  id: "gold-006-output",
  request: null as any,
  problem: {
    title: "Top K Best-Selling SKUs from a Day's Orders",
    statement: `An order-processing system emits a stream of order events, each containing a SKU (product identifier). At end-of-day, the merchandising team wants the **K SKUs that appear in the most orders**.\n\nReturn the K SKUs in descending order of frequency. Within the same frequency, smaller SKU comes first.`,
    inputFormat: "First line: integers n and K (1 ≤ K ≤ n ≤ 10^5). Second line: n space-separated integer SKUs.",
    outputFormat: "K space-separated integers on a single line.",
    constraints: ["1 ≤ K ≤ unique SKUs ≤ n ≤ 100,000"],
    examples: [
      { input: "8 2\n5 3 5 7 3 5 3 7", output: "3 5", explanation: "Counts: 5→3, 3→3, 7→2. Top 2 are 5 and 3 tied at 3; smaller (3) comes first." },
      { input: "5 1\n10 10 20 20 30", output: "10", explanation: "10 and 20 tied at 2; smaller (10) wins." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `import heapq
from collections import Counter

def top_k_skus(skus: list[int], k: int) -> list[int]:
    pass

if __name__ == "__main__":
    n, k = map(int, input().split())
    s = list(map(int, input().split()))
    print(*top_k_skus(s, k))`
  }],
  referenceSolution: {
    language: "python",
    code: `import heapq
from collections import Counter

def top_k_skus(skus, k):
    counts = Counter(skus)
    heap = []
    for sku, c in counts.items():
        if len(heap) < k:
            heapq.heappush(heap, (c, -sku))
        else:
            if (c, -sku) > heap[0]:
                heapq.heapreplace(heap, (c, -sku))
    result = sorted(heap, key=lambda x: (-x[0], -x[1]))
    return [-x[1] for x in result]

if __name__ == "__main__":
    n, k = map(int, input().split())
    s = list(map(int, input().split()))
    print(*top_k_skus(s, k))`,
    complexityTime: "O(n + u log k) where u is unique SKU count",
    complexitySpace: "O(u + k)"
  },
  bruteForceSolution: {
    language: "python",
    code: `from collections import Counter
def top_k_skus(skus, k):
    counts = Counter(skus)
    items = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    return [sku for sku, _ in items[:k]]`
  },
  testCases: [
    { id: "tc1", input: "8 2\n5 3 5 7 3 5 3 7", expectedOutput: "3 5", visibility: "sample", rationale: "Standard with tie." },
    { id: "tc2", input: "5 1\n10 10 20 20 30", expectedOutput: "10", visibility: "sample", rationale: "Single result with tie." },
    { id: "tc3", input: "1 1\n100", expectedOutput: "100", visibility: "hidden", rationale: "Minimum n=k=1." },
    { id: "tc4", input: "4 4\n1 2 3 4", expectedOutput: "1 2 3 4", visibility: "hidden", rationale: "K equals unique count; all tied." },
    { id: "tc5", input: "6 2\n1 1 1 2 2 2", expectedOutput: "1 2", visibility: "hidden", rationale: "Two SKUs tied; smaller first." },
    { id: "tc6", input: "6 2\n10 20 10 20 30 30", expectedOutput: "10 20", visibility: "hidden", rationale: "Three-way tie for top 2; smaller first." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Frequency counting via hashmap/Counter",
        weight: 0.2,
        anchors: {
          5: "Uses Counter or dict in single pass; O(n).",
          3: "Uses a hashmap but with a per-element scan for count.",
          1: "Doesn't count via hashmap."
        },
        evidenceRequired: "Use of Counter/dict for counts"
      },
      {
        dimension: "Heap-based top-K selection",
        weight: 0.4,
        anchors: {
          5: "Maintains a min-heap of size k; pushes/replaces in O(log k).",
          3: "Uses a heap but of size n (instead of k), missing the optimization.",
          1: "Uses sort or another algorithm — no heap."
        },
        evidenceRequired: "heapq with size-k invariant"
      },
      {
        dimension: "Tie-breaking",
        weight: 0.2,
        anchors: {
          5: "Smaller SKU wins on tie; correctly encoded in heap key (e.g., (count, -sku)).",
          3: "Tie-breaking works in some cases but fails on boundary.",
          1: "Wrong tie-breaking direction or no handling."
        },
        evidenceRequired: "Passes tc1, tc2, tc5"
      },
      {
        dimension: "Output ordering",
        weight: 0.2,
        anchors: {
          5: "Output sorted by descending count, then ascending SKU.",
          3: "Sorted by count only; ties in arbitrary order.",
          1: "No sorting."
        },
        evidenceRequired: "Output matches expected for all tests"
      }
    ],
    conceptsBeingAssessed: ["heaps", "priority_queue", "frequency_counting"],
    redFlags: ["sorts all unique SKUs (O(u log u) when O(u log k) is achievable)", "doesn't handle ties", "uses bucket sort assuming bounded counts"]
  },
  metadata: {
    conceptsRequired: ["heaps", "priority_queue", "frequency_counting", "hashmaps"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.55,
    estimatedSolveTimeMinutes: 40,
    realWorldDomain: "inventory",
    noveltyHash: "h-top-sku-006",
    sourceInspirations: [{ corpusId: "q-kth-largest", similarity: 0.42 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Combines frequency counting (hashmap) with bounded-size heap for top-K — the canonical integration of these patterns.",
    scenarioSelectionRationale: "Inventory analytics is a daily problem in commerce; top-K queries underpin merchandising decisions.",
    difficultyCalibrationRationale: "Medium-high: three concepts working together. Tie-breaking is the discriminator.",
    deviationsFromCorpus: "Kth-largest gives a single value; this requires the full top-K with deterministic tie-breaking."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T13:30:00Z"
};

const GOLD_007_OUTPUT: GeneratedAssignment = {
  id: "gold-007-output",
  request: null as any,
  problem: {
    title: "Minimum Introductions to Reach a Target Person",
    statement: `A professional networking platform represents connections as an undirected graph. Given a source user \`s\` and a target user \`t\`, return the **minimum number of introductions** needed to connect \`s\` to \`t\`. If they're directly connected, the answer is 1. If they're the same person, return 0. If unreachable, return -1.`,
    inputFormat: "First line: integers n, m, s, t. Next m lines: each 'u v' describing an edge.",
    outputFormat: "A single integer: minimum hops, or -1.",
    constraints: ["1 ≤ n ≤ 100,000", "0 ≤ m ≤ 200,000", "0 ≤ s, t < n"],
    examples: [
      { input: "6 5 0 5\n0 1\n1 2\n2 3\n3 5\n4 5", output: "4", explanation: "Path 0→1→2→3→5 has 4 hops." },
      { input: "3 1 0 2\n0 1", output: "-1", explanation: "Node 2 is isolated." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `from collections import deque

def min_introductions(n: int, edges: list[tuple[int,int]], s: int, t: int) -> int:
    pass

if __name__ == "__main__":
    n, m, s, t = map(int, input().split())
    edges = [tuple(map(int, input().split())) for _ in range(m)]
    print(min_introductions(n, edges, s, t))`
  }],
  referenceSolution: {
    language: "python",
    code: `from collections import deque

def min_introductions(n, edges, s, t):
    if s == t:
        return 0
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n
    visited[s] = True
    q = deque([(s, 0)])
    while q:
        node, dist = q.popleft()
        for nb in adj[node]:
            if not visited[nb]:
                if nb == t:
                    return dist + 1
                visited[nb] = True
                q.append((nb, dist + 1))
    return -1

if __name__ == "__main__":
    n, m, s, t = map(int, input().split())
    edges = [tuple(map(int, input().split())) for _ in range(m)]
    print(min_introductions(n, edges, s, t))`,
    complexityTime: "O(n + m)",
    complexitySpace: "O(n + m)"
  },
  bruteForceSolution: undefined,
  testCases: [
    { id: "tc1", input: "6 5 0 5\n0 1\n1 2\n2 3\n3 5\n4 5", expectedOutput: "4", visibility: "sample", rationale: "Standard path through chain." },
    { id: "tc2", input: "3 1 0 2\n0 1", expectedOutput: "-1", visibility: "sample", rationale: "Disconnected." },
    { id: "tc3", input: "1 0 0 0", expectedOutput: "0", visibility: "hidden", rationale: "Source equals target." },
    { id: "tc4", input: "2 1 0 1\n0 1", expectedOutput: "1", visibility: "hidden", rationale: "Direct connection." },
    { id: "tc5", input: "4 4 0 3\n0 1\n0 2\n1 3\n2 3", expectedOutput: "2", visibility: "hidden", rationale: "Multiple paths; BFS finds shortest." },
    { id: "tc6", input: "5 4 0 4\n0 1\n1 2\n2 3\n3 4", expectedOutput: "4", visibility: "hidden", rationale: "Chain graph; tests full path." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct BFS for shortest path",
        weight: 0.5,
        anchors: {
          5: "Uses queue, visits in level order with visited set; returns at first encounter of target.",
          3: "Uses BFS structurally but tracks distance via wrong field, or marks visited at dequeue instead of enqueue.",
          1: "Uses DFS or Dijkstra-style with priorities."
        },
        evidenceRequired: "deque-based traversal with visited set"
      },
      {
        dimension: "Adjacency list construction",
        weight: 0.2,
        anchors: {
          5: "Builds adjacency list from edges (undirected: both directions).",
          3: "Builds adjacency but treats as directed.",
          1: "Uses adjacency matrix (memory blow-up on n=10^5)."
        },
        evidenceRequired: "Both u→v and v→u added"
      },
      {
        dimension: "Boundary cases (same node, direct edge, disconnected)",
        weight: 0.2,
        anchors: {
          5: "s=t returns 0; direct edge returns 1; disconnected returns -1.",
          3: "Handles two of three.",
          1: "Wrong on multiple."
        },
        evidenceRequired: "Passes tc3, tc4, tc2"
      },
      {
        dimension: "Complexity",
        weight: 0.1,
        anchors: {
          5: "O(n+m); passes tc6.",
          3: "O(n×m) — recomputes adjacency or scans edges per step.",
          1: "Exponential / TLE."
        },
        evidenceRequired: "Passes tc6"
      }
    ],
    conceptsBeingAssessed: ["graph_traversal_bfs"],
    redFlags: ["uses DFS (not shortest path)", "uses Dijkstra (overkill for unweighted)", "doesn't mark visited (infinite loop on cycles)"]
  },
  metadata: {
    conceptsRequired: ["graph_traversal_bfs", "graphs", "queues"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.5,
    estimatedSolveTimeMinutes: 35,
    realWorldDomain: "social_network",
    noveltyHash: "h-min-intros-007",
    sourceInspirations: [{ corpusId: "q-num-islands", similarity: 0.25 }]
  },
  reasoningTrace: {
    conceptSelectionRationale: "Shortest-path-in-unweighted-graph is the canonical BFS application; social-network framing makes the unweighted property natural.",
    scenarioSelectionRationale: "Mutual-connection introductions are a real social-graph concept.",
    difficultyCalibrationRationale: "Medium: standard BFS, but the same-node and disconnected edge cases catch sloppy implementations.",
    deviationsFromCorpus: "Number-of-islands is grid-based BFS with connected-component counting; this is path-finding on a general graph."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T14:00:00Z"
};

const GOLD_008_OUTPUT: GeneratedAssignment = {
  id: "gold-008-output",
  request: null as any,
  problem: {
    title: "Days Until Next Price Drop",
    statement: `A trading dashboard tracks the closing price of a security for n consecutive trading days. For each day, the analyst wants to know: **how many days until a strictly lower closing price appears**? If no future day has a strictly lower price, output 0 for that day.\n\nGiven an array \`prices\` of closing prices, return an array \`days\` where \`days[i]\` is the number of trading days until a price lower than \`prices[i]\` is observed.`,
    inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Second line: n space-separated integers, each in [1, 10^9].",
    outputFormat: "n space-separated integers on a single line.",
    constraints: ["1 ≤ n ≤ 100,000", "Time: 2 seconds"],
    examples: [
      { input: "6\n100 105 102 99 110 108", output: "3 2 1 0 1 0", explanation: "Day 0 (100): next lower is day 3 (99) → 3 days. Day 4 (110): day 5 (108) → 1 day." },
      { input: "4\n10 9 8 7", output: "1 1 1 0", explanation: "Each next day is lower; last has no lower." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def days_until_lower(prices: list[int]) -> list[int]:
    pass

if __name__ == "__main__":
    n = int(input())
    p = list(map(int, input().split()))
    print(*days_until_lower(p))`
  }],
  referenceSolution: {
    language: "python",
    code: `def days_until_lower(prices):
    n = len(prices)
    res = [0] * n
    stack = []  # indices
    for i, p in enumerate(prices):
        while stack and prices[stack[-1]] > p:
            top = stack.pop()
            res[top] = i - top
        stack.append(i)
    return res

if __name__ == "__main__":
    n = int(input())
    p = list(map(int, input().split()))
    print(*days_until_lower(p))`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def days_until_lower(prices):
    res = []
    for i in range(len(prices)):
        days = 0
        for j in range(i+1, len(prices)):
            if prices[j] < prices[i]:
                days = j - i
                break
        res.append(days)
    return res`
  },
  testCases: [
    { id: "tc1", input: "6\n100 105 102 99 110 108", expectedOutput: "3 2 1 0 1 0", visibility: "sample", rationale: "Standard mixed case." },
    { id: "tc2", input: "4\n10 9 8 7", expectedOutput: "1 1 1 0", visibility: "sample", rationale: "Strictly decreasing." },
    { id: "tc3", input: "1\n5", expectedOutput: "0", visibility: "hidden", rationale: "Single element." },
    { id: "tc4", input: "4\n1 2 3 4", expectedOutput: "0 0 0 0", visibility: "hidden", rationale: "Strictly increasing — no lower day." },
    { id: "tc5", input: "5\n5 5 5 5 5", expectedOutput: "0 0 0 0 0", visibility: "hidden", rationale: "All equal — strictly lower never occurs." },
    { id: "tc6", input: "5\n3 1 3 1 3", expectedOutput: "1 0 1 0 0", visibility: "hidden", rationale: "Alternating with equal elements." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Monotonic stack pattern — maintain decreasing stack of indices",
        weight: 0.5,
        anchors: {
          5: "Maintains stack of unresolved indices; pops and records when a lower value is found. O(n) total.",
          3: "Uses a stack but with incorrect pop condition (e.g., pops on equal, missing strictly lower).",
          1: "Uses brute force O(n²) nested loops — no stack."
        },
        evidenceRequired: "Stack with while-pop loop in single forward pass"
      },
      {
        dimension: "Strict inequality handling",
        weight: 0.2,
        anchors: {
          5: "Uses strictly greater (prices[stack[-1]] > p), not >=. Passes tc5.",
          3: "Off by one direction — uses >= when > needed.",
          1: "Wrong condition throughout."
        },
        evidenceRequired: "Passes tc5 (all equal → all 0s)"
      },
      {
        dimension: "Result initialization and remaining indices",
        weight: 0.2,
        anchors: {
          5: "Initializes result array with 0s; remaining stack indices correctly yield 0.",
          3: "Forgets to initialize; some indices get garbage value.",
          1: "Wrong output size or crashes."
        },
        evidenceRequired: "Passes tc4 (increasing — all 0s)"
      },
      {
        dimension: "Complexity",
        weight: 0.1,
        anchors: {
          5: "O(n) amortized (each element pushed and popped at most once).",
          3: "O(n log n) with some sorting.",
          1: "O(n²) nested loops."
        },
        evidenceRequired: "Single-pass forward scan with stack"
      }
    ],
    conceptsBeingAssessed: ["monotonic_stack"],
    redFlags: ["uses nested loops", "uses heap instead of stack", "reverses array and uses next-greater instead"]
  },
  metadata: {
    conceptsRequired: ["monotonic_stack", "stacks", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.55,
    estimatedSolveTimeMinutes: 40,
    realWorldDomain: "trading",
    noveltyHash: "h-days-lower-008",
    sourceInspirations: []
  },
  reasoningTrace: {
    conceptSelectionRationale: "Monotonic decreasing stack is the target — maintain unresolved indices, pop on finding a lower value.",
    scenarioSelectionRationale: "Trading price analysis is a real-world use of this pattern; analysts track drawdown signals.",
    difficultyCalibrationRationale: "Medium-high: the non-obvious insight is maintaining a stack of pending queries rather than solving each independently.",
    deviationsFromCorpus: "Daily-temperatures uses next-greater (>=); this uses next-strictly-lower, requiring careful inequality direction."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T14:30:00Z"
};

const GOLD_009_OUTPUT: GeneratedAssignment = {
  id: "gold-009-output",
  request: null as any,
  problem: {
    title: "Minimum Edit Distance for Config Migration",
    statement: `A DevOps tool migrates configuration files between versions. Each config is represented as a string, and the tool uses **edit distance** to measure migration cost: the minimum number of single-character insertions, deletions, or substitutions to transform one config string into another.\n\nGiven strings \`source\` and \`target\`, return the edit distance between them.`,
    inputFormat: "Two lines: source string and target string (0 ≤ len ≤ 500; lowercase letters only).",
    outputFormat: "A single integer: minimum edit distance.",
    constraints: ["0 ≤ |source|, |target| ≤ 500", "Lowercase letters only", "Time: 2 seconds"],
    examples: [
      { input: "kitten\nsitting", output: "3", explanation: "kitten → sitten → sittin → sitting (sub k→s, sub e→i, insert g)." },
      { input: "abc\nabc", output: "0", explanation: "Identical strings." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def edit_distance(source: str, target: str) -> int:
    pass

if __name__ == "__main__":
    s = input()
    t = input()
    print(edit_distance(s, t))`
  }],
  referenceSolution: {
    language: "python",
    code: `def edit_distance(source, target):
    m, n = len(source), len(target)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if source[i-1] == target[j-1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j-1])
            prev = temp
    return dp[n]

if __name__ == "__main__":
    s = input(); t = input()
    print(edit_distance(s, t))`,
    complexityTime: "O(m × n)",
    complexitySpace: "O(min(m, n))"
  },
  bruteForceSolution: {
    language: "python",
    code: `from functools import lru_cache
def edit_distance(source, target):
    @lru_cache(maxsize=None)
    def dp(i, j):
        if i == 0: return j
        if j == 0: return i
        if source[i-1] == target[j-1]: return dp(i-1, j-1)
        return 1 + min(dp(i-1, j), dp(i, j-1), dp(i-1, j-1))
    return dp(len(source), len(target))`
  },
  testCases: [
    { id: "tc1", input: "kitten\nsitting", expectedOutput: "3", visibility: "sample", rationale: "Classic example." },
    { id: "tc2", input: "abc\nabc", expectedOutput: "0", visibility: "sample", rationale: "Identical strings." },
    { id: "tc3", input: "\nabc", expectedOutput: "3", visibility: "hidden", rationale: "Empty source — all insertions." },
    { id: "tc4", input: "abc\n", expectedOutput: "3", visibility: "hidden", rationale: "Empty target — all deletions." },
    { id: "tc5", input: "a\nb", expectedOutput: "1", visibility: "hidden", rationale: "Single character substitution." },
    { id: "tc6", input: "abcde\nedcba", expectedOutput: "4", visibility: "hidden", rationale: "Reverse string; tests complex edits." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct 2D DP recurrence",
        weight: 0.5,
        anchors: {
          5: "dp[i][j] = dp[i-1][j-1] if match, else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]). Correct base cases.",
          3: "Recurrence correct but base cases wrong (off-by-one in initialization).",
          1: "Wrong recurrence — doesn't cover all three operations."
        },
        evidenceRequired: "All three operations (insert, delete, substitute) modeled correctly"
      },
      {
        dimension: "Space optimization",
        weight: 0.2,
        anchors: {
          5: "Reduces O(m×n) array to O(min(m,n)) row using rolling array.",
          3: "Uses full O(m×n) array; correct but not optimized.",
          1: "Uses recursive without memoization — exponential."
        },
        evidenceRequired: "Single-row DP or justified 2D array"
      },
      {
        dimension: "Empty string handling",
        weight: 0.2,
        anchors: {
          5: "Empty source returns len(target); empty target returns len(source).",
          3: "One empty case handled; other crashes.",
          1: "Both empty cases wrong."
        },
        evidenceRequired: "Passes tc3, tc4"
      },
      {
        dimension: "Complexity",
        weight: 0.1,
        anchors: {
          5: "O(m×n) time, O(min(m,n)) space.",
          3: "O(m×n) time, O(m×n) space.",
          1: "Exponential time — TLE."
        },
        evidenceRequired: "Passes tc6 within time limit"
      }
    ],
    conceptsBeingAssessed: ["dynamic_programming_2d"],
    redFlags: ["greedy approach (incorrect)", "only counts substitutions (misses insert/delete)", "wrong base case initialization"]
  },
  metadata: {
    conceptsRequired: ["dynamic_programming_2d"],
    conceptsOptional: ["recursion"],
    estimatedDifficultyScore: 0.65,
    estimatedSolveTimeMinutes: 45,
    realWorldDomain: "devops",
    noveltyHash: "h-edit-dist-009",
    sourceInspirations: []
  },
  reasoningTrace: {
    conceptSelectionRationale: "Edit distance is the quintessential 2D DP problem. Config-migration framing grounds the string-diff abstractly.",
    scenarioSelectionRationale: "DevOps tooling that measures config drift is a real engineering use case.",
    difficultyCalibrationRationale: "Hard-medium: 2D DP requires careful state design and base-case initialization.",
    deviationsFromCorpus: "Longest palindromic substring is also 2D DP but for substrings; edit distance has different structure and three operations."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T15:00:00Z"
};

const GOLD_010_OUTPUT: GeneratedAssignment = {
  id: "gold-010-output",
  request: null as any,
  problem: {
    title: "Sorted Search in a Rotated Inventory List",
    statement: `A warehouse inventory system stores SKU IDs in a sorted array, but after a nightly rotation operation, the array has been rotated at an unknown pivot point. The search service must still find any given SKU in O(log n).\n\nGiven a rotated sorted array \`inventory\` of distinct integers, return the index of a target SKU, or -1 if not found.`,
    inputFormat: "First line: integer n and target. Second line: n space-separated distinct integers (sorted, then rotated).",
    outputFormat: "A single integer: index of target, or -1.",
    constraints: ["1 ≤ n ≤ 100,000", "All elements distinct", "Time: 2 seconds"],
    examples: [
      { input: "7 0\n4 5 6 7 0 1 2", output: "4", explanation: "0 is at index 4." },
      { input: "5 3\n1 2 3 4 5", output: "2", explanation: "Not rotated; 3 is at index 2." }
    ]
  },
  starterCode: [{
    language: "python",
    code: `def search_rotated(inventory: list[int], target: int) -> int:
    pass

if __name__ == "__main__":
    n, target = map(int, input().split())
    inv = list(map(int, input().split()))
    print(search_rotated(inv, target))`
  }],
  referenceSolution: {
    language: "python",
    code: `def search_rotated(inventory, target):
    lo, hi = 0, len(inventory) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if inventory[mid] == target:
            return mid
        if inventory[lo] <= inventory[mid]:  # left half sorted
            if inventory[lo] <= target < inventory[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # right half sorted
            if inventory[mid] < target <= inventory[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

if __name__ == "__main__":
    n, target = map(int, input().split())
    inv = list(map(int, input().split()))
    print(search_rotated(inv, target))`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)"
  },
  bruteForceSolution: {
    language: "python",
    code: `def search_rotated(inventory, target):
    try:
        return inventory.index(target)
    except ValueError:
        return -1`
  },
  testCases: [
    { id: "tc1", input: "7 0\n4 5 6 7 0 1 2", expectedOutput: "4", visibility: "sample", rationale: "Target in right portion." },
    { id: "tc2", input: "5 3\n1 2 3 4 5", expectedOutput: "2", visibility: "sample", rationale: "Not rotated." },
    { id: "tc3", input: "1 0\n0", expectedOutput: "0", visibility: "hidden", rationale: "Single element found." },
    { id: "tc4", input: "1 5\n0", expectedOutput: "-1", visibility: "hidden", rationale: "Single element not found." },
    { id: "tc5", input: "4 3\n3 1 2 3", expectedOutput: "0", visibility: "hidden", rationale: "Target at first position after rotation." },
    { id: "tc6", input: "5 99\n4 5 6 7 0", expectedOutput: "-1", visibility: "hidden", rationale: "Target not in array." }
  ],
  rubric: {
    evaluationDimensions: [
      {
        dimension: "Correct binary search on rotated array",
        weight: 0.5,
        anchors: {
          5: "Identifies which half is sorted at each step; narrows correctly. Achieves O(log n).",
          3: "Binary search framework correct but wrong half-identification in some cases.",
          1: "Uses linear scan or doesn't handle rotation."
        },
        evidenceRequired: "Two-branch logic identifying sorted vs rotated half"
      },
      {
        dimension: "Correct boundary conditions",
        weight: 0.3,
        anchors: {
          5: "Handles lo == hi, target at boundary, single element correctly.",
          3: "Off-by-one in boundary comparisons.",
          1: "Infinite loop or wrong result on boundary inputs."
        },
        evidenceRequired: "Passes tc3, tc4, tc5"
      },
      {
        dimension: "Complexity",
        weight: 0.2,
        anchors: {
          5: "O(log n) time, O(1) space.",
          3: "O(n) fallback in some cases.",
          1: "O(n) throughout (linear scan)."
        },
        evidenceRequired: "No linear scans in loop body"
      }
    ],
    conceptsBeingAssessed: ["binary_search"],
    redFlags: ["uses .index() (O(n))", "doesn't check which half is sorted", "uses extra O(n) space to 'un-rotate'"]
  },
  metadata: {
    conceptsRequired: ["binary_search", "arrays"],
    conceptsOptional: [],
    estimatedDifficultyScore: 0.55,
    estimatedSolveTimeMinutes: 35,
    realWorldDomain: "inventory",
    noveltyHash: "h-rot-search-010",
    sourceInspirations: []
  },
  reasoningTrace: {
    conceptSelectionRationale: "Binary search on rotated sorted array is the canonical test of understanding sorted-half identification.",
    scenarioSelectionRationale: "Inventory rotation is a natural metaphor; the 'rotated nightly' story grounds the algorithm.",
    difficultyCalibrationRationale: "Medium: standard binary search plus one layer of case analysis.",
    deviationsFromCorpus: "No direct corpus match; rotated search is a distinct variant of binary search."
  },
  versions: GOLD_VERSIONS,
  createdAt: "2026-01-17T15:30:00Z"
};

export const DSA_GOLD_SET: GoldSetEntry[] = [
  {
    id: "gold-001",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: { primary: ["hashmaps", "frequency_counting"], secondary: ["arrays"], mustNotRequire: ["dynamic_programming_1d", "dynamic_programming_2d", "graphs"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 25, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "observability", avoidOverused: ["two_sum", "fizzbuzz"] },
      corpusSliceIds: ["q-two-sum", "q-group-anagrams"]
    },
    output: GOLD_001_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T11:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-002",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: { primary: ["two_pointers"], secondary: ["sorting", "arrays"], mustNotRequire: ["dynamic_programming_1d", "heaps", "graphs"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "logistics", avoidOverused: ["three_sum"] },
      corpusSliceIds: ["q-three-sum"]
    },
    output: GOLD_002_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T11:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-003",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: { primary: ["sliding_window"], secondary: ["arrays"], mustNotRequire: ["heaps", "dynamic_programming_1d"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "infrastructure", avoidOverused: ["max_average_subarray"] },
      corpusSliceIds: ["q-longest-unique-substring"]
    },
    output: GOLD_003_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T12:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-004",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: { primary: ["dynamic_programming_1d"], secondary: ["arrays", "recursion"], mustNotRequire: ["graphs", "heaps"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "advertising", avoidOverused: ["house_robber"] },
      corpusSliceIds: ["q-word-break", "q-coin-change"]
    },
    output: GOLD_004_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T12:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-005",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion",
      targetConcepts: { primary: ["tree_traversal_dfs", "binary_search_tree"], secondary: ["recursion"], mustNotRequire: ["dynamic_programming_1d", "heaps"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "pricing", avoidOverused: ["validate_bst"] },
      corpusSliceIds: ["q-binary-tree-inorder"]
    },
    output: GOLD_005_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T13:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-006",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-heaps-and-stacks",
      targetConcepts: { primary: ["heaps", "priority_queue", "frequency_counting"], secondary: ["hashmaps"], mustNotRequire: ["dynamic_programming_1d", "graphs"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 3, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "inventory", avoidOverused: ["top_k_frequent_elements"] },
      corpusSliceIds: ["q-kth-largest", "q-group-anagrams"]
    },
    output: GOLD_006_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T13:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-007",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion",
      targetConcepts: { primary: ["graph_traversal_bfs"], secondary: ["graphs", "queues"], mustNotRequire: ["dynamic_programming_1d", "heaps"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "social_network", avoidOverused: ["number_of_islands"] },
      corpusSliceIds: ["q-num-islands"]
    },
    output: GOLD_007_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T14:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-008",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-heaps-and-stacks",
      targetConcepts: { primary: ["monotonic_stack"], secondary: ["stacks", "arrays"], mustNotRequire: ["dynamic_programming_1d", "heaps"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "trading", avoidOverused: ["daily_temperatures"] },
      corpusSliceIds: []
    },
    output: GOLD_008_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T14:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-009",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion",
      targetConcepts: { primary: ["dynamic_programming_2d"], secondary: ["recursion"], mustNotRequire: ["graphs", "heaps"] },
      difficultyTarget: { tier: "hard", expectedSolveTimeMinutes: 45, expectedConceptCount: 2, constraintComplexity: "many" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "devops", avoidOverused: ["edit_distance"] },
      corpusSliceIds: []
    },
    output: GOLD_009_OUTPUT,
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T15:00:00Z",
    status: "candidate",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },
  {
    id: "gold-010",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: { primary: ["binary_search"], secondary: ["arrays"], mustNotRequire: ["dynamic_programming_1d", "graphs"] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 1, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "inventory", avoidOverused: ["rotated_search"] },
      corpusSliceIds: []
    },
    output: GOLD_010_OUTPUT,
    authoredBy: "user-admin-1",
    authoredAt: "2026-01-17T15:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  }
];
