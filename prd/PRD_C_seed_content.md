# PRD — Pre-Authored Seed Content (DSA)

## Document C of 3
This document contains **all pre-authored seed content** for the DSA category, ready to be dropped into the prototype defined in Document A (frontend) and Document B (full-stack backend).

The content is provided as TypeScript modules using the type definitions from Document A section 4. The agent should split each section below into the corresponding file under `/web/lib/seed/dsa/`. For the backend prototype (Document B), the same semantic content is loaded by `/scripts/seed.py` after type-translation to SQLAlchemy models.

### Files this document produces

```
/lib/seed/dsa/
  index.ts                  # re-exports
  taxonomy.ts               # 31 concepts
  classContexts.ts          # 4 class contexts
  corpus.ts                 # 15 interview questions
  goldSet.ts                # 10 gold-set entries
  prompts.ts                # generation + extraction + 6 judge + difficulty
  assignments.ts            # 6 example assignments in various states
  promptProposals.ts        # 2 pending prompt proposals
  conceptProposals.ts       # 1 pending concept proposal
```

### Conventions

- Concept IDs are snake_case slugs.
- All timestamps in seed data use ISO 8601 with a fixed "2026-01-15T10:00:00Z" baseline, offset by realistic deltas for narrative coherence.
- Authoring user IDs are `"user-instructor-1"` and `"user-admin-1"`. The seed loader maps these to real user records.
- Code in solutions is Python 3 unless noted.
- Sources for interview corpus reference public well-known problem patterns; the wording is original.

---

## 1. Taxonomy (`taxonomy.ts`)

31 concepts spanning data structures and algorithm patterns. Hierarchy: top-level domains (arrays, hashmaps, trees, etc.) → patterns/techniques as leaves.

```ts
import type { Concept } from "../../types";

export const DSA_CONCEPTS: Concept[] = [
  // ===== Arrays =====
  {
    id: "arrays",
    categoryId: "dsa",
    canonicalName: "Arrays",
    aliases: ["lists", "sequences"],
    definition: "Linear, index-addressable sequences of elements stored contiguously. Foundational data structure for most algorithmic patterns.",
    parentId: null,
    depthCriteria: {
      introduced: "Knows how to access elements by index and iterate",
      applied: "Manipulates arrays in place; understands O(1) random access vs O(n) search",
      mastered: "Reasons about cache locality, in-place transformations, and array as substrate for other DS"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "array_techniques",
    categoryId: "dsa",
    canonicalName: "Array Techniques",
    aliases: [],
    definition: "Algorithmic patterns that operate over arrays without auxiliary structures.",
    parentId: "arrays",
    depthCriteria: {
      introduced: "Recognizes when a pattern applies",
      applied: "Implements the pattern correctly for standard variations",
      mastered: "Identifies non-obvious applicability in novel problems"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "two_pointers",
    categoryId: "dsa",
    canonicalName: "Two Pointers",
    aliases: ["two pointer technique", "left-right pointers"],
    definition: "An algorithmic pattern using two indices traversing a data structure simultaneously, typically from opposite ends or at different speeds, to reduce time complexity from O(n²) to O(n).",
    parentId: "array_techniques",
    depthCriteria: {
      introduced: "Recognizes the pattern when shown an example",
      applied: "Implements two-pointer solutions for pair-sum, palindrome check, partitioning",
      mastered: "Identifies applicability in novel problems; adapts for fast-slow pointer variants"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "sliding_window",
    categoryId: "dsa",
    canonicalName: "Sliding Window",
    aliases: ["window technique"],
    definition: "An algorithmic pattern maintaining a contiguous subrange of an array or string and expanding/contracting it to satisfy a constraint, achieving O(n) where naive solutions are O(n·k) or O(n²).",
    parentId: "array_techniques",
    depthCriteria: {
      introduced: "Recognizes the pattern with fixed window size",
      applied: "Implements variable-size windows; uses hashmap to track window state",
      mastered: "Designs windows for novel constraints; reasons about invariant maintenance"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "prefix_sum",
    categoryId: "dsa",
    canonicalName: "Prefix Sum",
    aliases: ["cumulative sum", "running total"],
    definition: "Precomputed array of cumulative sums enabling O(1) range-sum queries on a static array after O(n) preprocessing.",
    parentId: "array_techniques",
    depthCriteria: {
      introduced: "Computes a prefix sum array correctly",
      applied: "Uses prefix sums for range queries; extends to 2D",
      mastered: "Combines with hashmap for subarray-sum-equals-k style problems"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Hashmaps =====
  {
    id: "hashmaps",
    categoryId: "dsa",
    canonicalName: "Hashmaps",
    aliases: ["dictionaries", "hashtables"],
    definition: "Associative data structure offering O(1) average-case insertion, lookup, and deletion via hashing.",
    parentId: null,
    depthCriteria: {
      introduced: "Uses hashmap for basic key-value storage",
      applied: "Picks hashmap to convert O(n²) to O(n) algorithms",
      mastered: "Reasons about hash collisions, load factor, and ordered alternatives"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "frequency_counting",
    categoryId: "dsa",
    canonicalName: "Frequency Counting",
    aliases: ["counter", "occurrence count"],
    definition: "Pattern of using a hashmap (or Counter) to tally occurrences of elements, often a preprocessing step for grouping, deduplication, or top-k problems.",
    parentId: "hashmaps",
    depthCriteria: {
      introduced: "Counts occurrences of elements in a collection",
      applied: "Uses frequency counts to answer grouping and ranking questions",
      mastered: "Combines with other patterns (sliding window, heap) for complex constraints"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "hashmap_lookup",
    categoryId: "dsa",
    canonicalName: "Hashmap Lookup",
    aliases: ["complement lookup"],
    definition: "Pattern of storing previously-seen values in a hashmap and checking for a needed value (e.g., complement, predecessor) during a single pass.",
    parentId: "hashmaps",
    depthCriteria: {
      introduced: "Uses a hashmap to remember seen elements",
      applied: "Applies complement-lookup for pair-sum, indexed lookup for arrays",
      mastered: "Designs lookup keys for non-trivial relationships"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Strings =====
  {
    id: "strings",
    categoryId: "dsa",
    canonicalName: "Strings",
    aliases: [],
    definition: "Sequences of characters; share many algorithmic patterns with arrays but with specific concerns around encoding, immutability, and substring operations.",
    parentId: null,
    depthCriteria: {
      introduced: "Indexes, slices, and concatenates strings",
      applied: "Reasons about immutability and uses join/builder patterns",
      mastered: "Handles encoding, case-folding, and substring algorithms"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "string_manipulation",
    categoryId: "dsa",
    canonicalName: "String Manipulation",
    aliases: ["string operations"],
    definition: "Patterns for transforming, comparing, and parsing strings: reversal, splitting, palindrome checks, anagram detection.",
    parentId: "strings",
    depthCriteria: {
      introduced: "Performs basic operations like reversal, case change",
      applied: "Detects palindromes and anagrams; handles edge cases",
      mastered: "Implements efficient substring search and parsing"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Linked Lists =====
  {
    id: "linked_lists",
    categoryId: "dsa",
    canonicalName: "Linked Lists",
    aliases: [],
    definition: "Linear data structures composed of nodes with pointers to subsequent nodes. Singly and doubly linked variants common.",
    parentId: null,
    depthCriteria: {
      introduced: "Traverses and modifies pointers correctly",
      applied: "Implements reversal, cycle detection, merging",
      mastered: "Handles dummy heads, pointer manipulation under aliasing"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "linked_list_traversal",
    categoryId: "dsa",
    canonicalName: "Linked List Traversal",
    aliases: [],
    definition: "Walking through nodes via next pointers; foundation for all linked-list algorithms.",
    parentId: "linked_lists",
    depthCriteria: {
      introduced: "Iterates from head to tail",
      applied: "Modifies pointers in place while traversing",
      mastered: "Handles multi-pointer traversals and recursive variants"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "fast_slow_pointers",
    categoryId: "dsa",
    canonicalName: "Fast and Slow Pointers",
    aliases: ["Floyd's cycle detection", "tortoise and hare"],
    definition: "Pattern using two pointers moving at different speeds to detect cycles, find midpoints, or solve nth-from-end problems.",
    parentId: "linked_lists",
    depthCriteria: {
      introduced: "Knows the cycle-detection algorithm",
      applied: "Applies for cycle detection and middle-of-list",
      mastered: "Identifies use in numerical problems (happy number) and adapts for variants"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Stacks & Queues =====
  {
    id: "stacks",
    categoryId: "dsa",
    canonicalName: "Stacks",
    aliases: ["LIFO"],
    definition: "Last-in-first-out data structure; key for backtracking, expression evaluation, and depth-first traversal without recursion.",
    parentId: null,
    depthCriteria: {
      introduced: "Uses push/pop/peek correctly",
      applied: "Applies stacks to balanced-brackets, expression evaluation",
      mastered: "Designs stack-based algorithms for non-obvious problems"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "monotonic_stack",
    categoryId: "dsa",
    canonicalName: "Monotonic Stack",
    aliases: ["increasing stack", "decreasing stack"],
    definition: "A stack maintained in monotonically increasing or decreasing order, used for next-greater-element, daily-temperatures-style problems in O(n).",
    parentId: "stacks",
    depthCriteria: {
      introduced: "Recognizes the pattern when shown",
      applied: "Implements next-greater-element variants",
      mastered: "Adapts for histograms, range queries, and circular variants"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "queues",
    categoryId: "dsa",
    canonicalName: "Queues",
    aliases: ["FIFO"],
    definition: "First-in-first-out data structure; foundational for BFS and level-order processing.",
    parentId: null,
    depthCriteria: {
      introduced: "Uses enqueue/dequeue correctly",
      applied: "Uses queues for BFS and level-order traversal",
      mastered: "Implements deques for sliding-window-max and similar"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Trees =====
  {
    id: "trees",
    categoryId: "dsa",
    canonicalName: "Trees",
    aliases: [],
    definition: "Hierarchical data structures with parent-child relationships; binary trees most common in interviews.",
    parentId: null,
    depthCriteria: {
      introduced: "Defines tree structure with node and children",
      applied: "Traverses recursively and iteratively",
      mastered: "Reasons about balanced vs unbalanced; modifies tree structure safely"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "tree_traversal_dfs",
    categoryId: "dsa",
    canonicalName: "Tree DFS Traversal",
    aliases: ["depth-first traversal", "preorder/inorder/postorder"],
    definition: "Recursive or stack-based traversal exploring as deep as possible before backtracking.",
    parentId: "trees",
    depthCriteria: {
      introduced: "Writes recursive traversal for one order",
      applied: "Handles all three orders; iterative implementation",
      mastered: "Applies DFS for path-sum, ancestor, and structural problems"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "tree_traversal_bfs",
    categoryId: "dsa",
    canonicalName: "Tree BFS Traversal",
    aliases: ["level-order traversal"],
    definition: "Queue-based traversal exploring nodes level by level.",
    parentId: "trees",
    depthCriteria: {
      introduced: "Implements level-order traversal",
      applied: "Tracks levels explicitly; uses for level-based questions",
      mastered: "Adapts for zigzag, right-view, and width problems"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "binary_search_tree",
    categoryId: "dsa",
    canonicalName: "Binary Search Tree",
    aliases: ["BST"],
    definition: "Binary tree where every node's left subtree contains smaller values and right subtree contains larger values; enables O(log n) search on balanced trees.",
    parentId: "trees",
    depthCriteria: {
      introduced: "Knows BST property and basic search",
      applied: "Validates BST property; performs insertion and search",
      mastered: "Reasons about balance, deletion edge cases, and BST-to-array conversions"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Graphs =====
  {
    id: "graphs",
    categoryId: "dsa",
    canonicalName: "Graphs",
    aliases: [],
    definition: "Generalizations of trees with arbitrary connectivity; modeled as adjacency lists or matrices.",
    parentId: null,
    depthCriteria: {
      introduced: "Represents graphs in code; understands directed vs undirected",
      applied: "Performs traversals correctly with visited tracking",
      mastered: "Models problems as graphs; chooses representations for memory/time tradeoffs"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "graph_traversal_dfs",
    categoryId: "dsa",
    canonicalName: "Graph DFS",
    aliases: ["depth-first search on graphs"],
    definition: "Depth-first traversal of graphs with cycle prevention via visited set.",
    parentId: "graphs",
    depthCriteria: {
      introduced: "Writes recursive DFS with visited tracking",
      applied: "Applies for connected components, cycle detection",
      mastered: "Uses DFS for SCC, topological sort, and backtracking"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "graph_traversal_bfs",
    categoryId: "dsa",
    canonicalName: "Graph BFS",
    aliases: ["breadth-first search on graphs"],
    definition: "Level-by-level traversal of graphs; gives shortest path in unweighted graphs.",
    parentId: "graphs",
    depthCriteria: {
      introduced: "Implements BFS with queue and visited set",
      applied: "Uses BFS for shortest-path in unweighted graphs",
      mastered: "Adapts for multi-source BFS, bidirectional, and 0-1 BFS"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "topological_sort",
    categoryId: "dsa",
    canonicalName: "Topological Sort",
    aliases: ["topo sort", "DAG ordering"],
    definition: "Linear ordering of vertices in a DAG such that for every edge u→v, u appears before v.",
    parentId: "graphs",
    depthCriteria: {
      introduced: "Knows the concept and use cases",
      applied: "Implements Kahn's algorithm or DFS-based variant",
      mastered: "Handles cycle detection, multiple valid orderings, and lexicographic constraints"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Heaps =====
  {
    id: "heaps",
    categoryId: "dsa",
    canonicalName: "Heaps",
    aliases: ["binary heap"],
    definition: "Tree-based data structure satisfying heap property; min-heap or max-heap variants.",
    parentId: null,
    depthCriteria: {
      introduced: "Knows heap property and basic operations",
      applied: "Uses heaps for top-k and priority scheduling",
      mastered: "Implements heap from scratch; reasons about heapify and amortized costs"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "priority_queue",
    categoryId: "dsa",
    canonicalName: "Priority Queue",
    aliases: ["PQ", "min-heap usage"],
    definition: "Abstract data type maintaining elements by priority; typically implemented as a heap.",
    parentId: "heaps",
    depthCriteria: {
      introduced: "Uses heapq or PriorityQueue library calls",
      applied: "Solves top-k and merge-k-lists with PQ",
      mastered: "Designs custom comparators; uses for Dijkstra, A*, and event simulation"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Searching & Sorting =====
  {
    id: "sorting",
    categoryId: "dsa",
    canonicalName: "Sorting",
    aliases: [],
    definition: "Arranging elements according to a comparator; foundational subroutine for many algorithms.",
    parentId: null,
    depthCriteria: {
      introduced: "Uses language sort functions",
      applied: "Picks sort algorithms appropriate to constraints; uses custom comparators",
      mastered: "Implements quicksort, mergesort; reasons about stability and partial sorting"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "binary_search",
    categoryId: "dsa",
    canonicalName: "Binary Search",
    aliases: ["bisection"],
    definition: "O(log n) search in sorted data; generalizes to binary search on answer space.",
    parentId: null,
    depthCriteria: {
      introduced: "Implements binary search on sorted array",
      applied: "Handles boundary cases; uses bisect library variants",
      mastered: "Applies binary search on answer space and monotonic predicates"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Recursion & DP =====
  {
    id: "recursion",
    categoryId: "dsa",
    canonicalName: "Recursion",
    aliases: [],
    definition: "Functions defined in terms of themselves; foundational for divide-and-conquer, backtracking, and tree algorithms.",
    parentId: null,
    depthCriteria: {
      introduced: "Writes recursive functions with correct base cases",
      applied: "Reasons about recursion depth, call stack, and termination",
      mastered: "Converts between recursive and iterative; uses memoization fluently"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "dynamic_programming_1d",
    categoryId: "dsa",
    canonicalName: "1D Dynamic Programming",
    aliases: ["1D DP", "linear DP"],
    definition: "DP problems with state representable by a single index; subproblems form a linear dependency.",
    parentId: "recursion",
    depthCriteria: {
      introduced: "Recognizes overlapping subproblems pattern",
      applied: "Writes tabulated DP for Fibonacci-style, house-robber-style problems",
      mastered: "Identifies state space; converts top-down to bottom-up; optimizes space to O(1)"
    },
    status: "active",
    taxonomyVersion: 1
  },
  {
    id: "dynamic_programming_2d",
    categoryId: "dsa",
    canonicalName: "2D Dynamic Programming",
    aliases: ["2D DP", "grid DP"],
    definition: "DP problems where state requires two indices; common for substring, grid path, and matching problems.",
    parentId: "recursion",
    depthCriteria: {
      introduced: "Recognizes 2D state in tabulation",
      applied: "Writes 2D DP for LCS, edit distance, grid paths",
      mastered: "Optimizes space, handles non-obvious state design"
    },
    status: "active",
    taxonomyVersion: 1
  },

  // ===== Other =====
  {
    id: "greedy",
    categoryId: "dsa",
    canonicalName: "Greedy Algorithms",
    aliases: [],
    definition: "Algorithms making locally optimal choices at each step; correct when the problem has greedy choice property.",
    parentId: null,
    depthCriteria: {
      introduced: "Knows the concept and a canonical example",
      applied: "Recognizes greedy applicability and implements correctly",
      mastered: "Proves correctness of greedy strategy; distinguishes from DP"
    },
    status: "active",
    taxonomyVersion: 1
  }
];
```

---

## 2. Class contexts (`classContexts.ts`)

Four class contexts spanning the curriculum, each with realistic extracted-and-confirmed concepts at appropriate depths.

```ts
import type { ClassContext } from "../../types";

export const DSA_CLASS_CONTEXTS: ClassContext[] = [
  {
    id: "ctx-arrays-and-hashing",
    categoryId: "dsa",
    moduleId: "dsa_module_05",
    title: "Arrays and Hash-Based Lookups",
    uploadedFiles: [
      { name: "lecture_arrays_hashing.vtt", uri: "s3://seed/ctx-arrays-and-hashing/lecture.vtt" },
      { name: "slides_arrays_hashing.pdf", uri: "s3://seed/ctx-arrays-and-hashing/slides.pdf" }
    ],
    extractedConcepts: [
      { conceptId: "arrays", depth: "mastered", confidence: 0.99, confirmedByInstructor: true },
      { conceptId: "hashmaps", depth: "applied", confidence: 0.97, confirmedByInstructor: true },
      { conceptId: "hashmap_lookup", depth: "applied", confidence: 0.94, confirmedByInstructor: true },
      { conceptId: "frequency_counting", depth: "applied", confidence: 0.92, confirmedByInstructor: true },
      { conceptId: "two_pointers", depth: "introduced", confidence: 0.71, confirmedByInstructor: true }
    ],
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "ctx-sliding-window-and-prefix",
    categoryId: "dsa",
    moduleId: "dsa_module_07",
    title: "Sliding Window and Prefix Sums",
    uploadedFiles: [
      { name: "lecture_window_prefix.vtt", uri: "s3://seed/ctx-sliding-window-and-prefix/lecture.vtt" }
    ],
    extractedConcepts: [
      { conceptId: "arrays", depth: "mastered", confidence: 0.99, confirmedByInstructor: true },
      { conceptId: "hashmaps", depth: "mastered", confidence: 0.98, confirmedByInstructor: true },
      { conceptId: "two_pointers", depth: "applied", confidence: 0.93, confirmedByInstructor: true },
      { conceptId: "sliding_window", depth: "applied", confidence: 0.95, confirmedByInstructor: true },
      { conceptId: "prefix_sum", depth: "applied", confidence: 0.89, confirmedByInstructor: true },
      { conceptId: "frequency_counting", depth: "mastered", confidence: 0.96, confirmedByInstructor: true }
    ],
    createdAt: "2026-01-29T10:00:00Z"
  },
  {
    id: "ctx-trees-and-recursion",
    categoryId: "dsa",
    moduleId: "dsa_module_11",
    title: "Trees and Recursive Traversal",
    uploadedFiles: [
      { name: "lecture_trees.vtt", uri: "s3://seed/ctx-trees-and-recursion/lecture.vtt" }
    ],
    extractedConcepts: [
      { conceptId: "recursion", depth: "applied", confidence: 0.96, confirmedByInstructor: true },
      { conceptId: "trees", depth: "applied", confidence: 0.95, confirmedByInstructor: true },
      { conceptId: "tree_traversal_dfs", depth: "applied", confidence: 0.94, confirmedByInstructor: true },
      { conceptId: "tree_traversal_bfs", depth: "applied", confidence: 0.88, confirmedByInstructor: true },
      { conceptId: "binary_search_tree", depth: "applied", confidence: 0.91, confirmedByInstructor: true },
      { conceptId: "queues", depth: "applied", confidence: 0.86, confirmedByInstructor: true }
    ],
    createdAt: "2026-02-19T10:00:00Z"
  },
  {
    id: "ctx-heaps-and-stacks",
    categoryId: "dsa",
    moduleId: "dsa_module_13",
    title: "Heaps, Priority Queues, and Monotonic Stacks",
    uploadedFiles: [
      { name: "lecture_heaps_stacks.vtt", uri: "s3://seed/ctx-heaps-and-stacks/lecture.vtt" }
    ],
    extractedConcepts: [
      { conceptId: "arrays", depth: "mastered", confidence: 0.99, confirmedByInstructor: true },
      { conceptId: "hashmaps", depth: "mastered", confidence: 0.98, confirmedByInstructor: true },
      { conceptId: "stacks", depth: "applied", confidence: 0.94, confirmedByInstructor: true },
      { conceptId: "monotonic_stack", depth: "applied", confidence: 0.89, confirmedByInstructor: true },
      { conceptId: "heaps", depth: "applied", confidence: 0.92, confirmedByInstructor: true },
      { conceptId: "priority_queue", depth: "applied", confidence: 0.95, confirmedByInstructor: true },
      { conceptId: "frequency_counting", depth: "mastered", confidence: 0.97, confirmedByInstructor: true }
    ],
    createdAt: "2026-03-05T10:00:00Z"
  }
];
```

---

## 3. Interview corpus (`corpus.ts`)

15 reference interview questions modeled on widely-circulated public DSA problems. Wording is original; each entry attributes the canonical problem it references.

```ts
import type { InterviewQuestion } from "../../types";

export const DSA_CORPUS: InterviewQuestion[] = [
  {
    id: "q-two-sum",
    categoryId: "dsa",
    title: "Pair Sum (canonical: Two Sum)",
    body: "Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. Each input has exactly one solution; you may not use the same element twice.",
    source: "Public canonical (LeetCode-style); appears in interviews at Amazon, Google, and similar.",
    taggedConcepts: ["arrays", "hashmaps", "hashmap_lookup"],
    difficulty: "easy",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-valid-parens",
    categoryId: "dsa",
    title: "Balanced Brackets (canonical: Valid Parentheses)",
    body: "Given a string containing only the characters '(', ')', '{', '}', '[', ']', determine if the brackets are balanced and properly nested.",
    source: "Public canonical; very common at entry-level interviews.",
    taggedConcepts: ["stacks", "string_manipulation"],
    difficulty: "easy",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-reverse-ll",
    categoryId: "dsa",
    title: "Reverse Linked List",
    body: "Given the head of a singly linked list, reverse the list in place and return the new head.",
    source: "Public canonical; standard linked-list interview question.",
    taggedConcepts: ["linked_lists", "linked_list_traversal"],
    difficulty: "easy",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-merge-intervals",
    categoryId: "dsa",
    title: "Merge Overlapping Intervals",
    body: "Given a list of intervals where each is [start, end], merge all overlapping intervals and return the result.",
    source: "Public canonical; common at Meta, Microsoft.",
    taggedConcepts: ["sorting", "arrays"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-group-anagrams",
    categoryId: "dsa",
    title: "Group Anagrams",
    body: "Given an array of strings, group strings that are anagrams of each other.",
    source: "Public canonical; appears at Amazon, Uber.",
    taggedConcepts: ["hashmaps", "strings", "frequency_counting"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-longest-unique-substring",
    categoryId: "dsa",
    title: "Longest Substring Without Repeating Characters",
    body: "Given a string, find the length of the longest substring that contains no repeated characters.",
    source: "Public canonical; very common at Google, Facebook.",
    taggedConcepts: ["sliding_window", "hashmaps", "strings"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-three-sum",
    categoryId: "dsa",
    title: "Triplets Summing to Zero (canonical: 3Sum)",
    body: "Given an array of integers, find all unique triplets in the array that sum to zero.",
    source: "Public canonical; appears at Bloomberg, Facebook.",
    taggedConcepts: ["two_pointers", "sorting", "arrays"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-binary-tree-inorder",
    categoryId: "dsa",
    title: "Binary Tree Inorder Traversal",
    body: "Given the root of a binary tree, return the inorder traversal of its node values.",
    source: "Public canonical.",
    taggedConcepts: ["trees", "tree_traversal_dfs", "recursion"],
    difficulty: "easy",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-course-schedule",
    categoryId: "dsa",
    title: "Prerequisite Course Ordering (canonical: Course Schedule)",
    body: "Given a number of courses labeled 0 to n-1 and a list of prerequisite pairs [a,b] meaning b must be taken before a, return a valid ordering or detect that none exists.",
    source: "Public canonical; appears at Microsoft, Amazon.",
    taggedConcepts: ["graphs", "topological_sort", "graph_traversal_dfs"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-kth-largest",
    categoryId: "dsa",
    title: "Kth Largest Element in Array",
    body: "Given an unsorted array of integers and an integer k, return the kth largest element.",
    source: "Public canonical; appears at Facebook, Amazon.",
    taggedConcepts: ["heaps", "priority_queue", "sorting"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-longest-palindrome",
    categoryId: "dsa",
    title: "Longest Palindromic Substring",
    body: "Given a string, return the longest substring that is a palindrome.",
    source: "Public canonical; common at Amazon.",
    taggedConcepts: ["strings", "dynamic_programming_2d", "string_manipulation"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-word-break",
    categoryId: "dsa",
    title: "Word Break",
    body: "Given a string and a dictionary of words, determine if the string can be segmented into a space-separated sequence of dictionary words.",
    source: "Public canonical.",
    taggedConcepts: ["dynamic_programming_1d", "strings", "hashmaps"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-num-islands",
    categoryId: "dsa",
    title: "Number of Islands",
    body: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is land cells connected horizontally or vertically.",
    source: "Public canonical; appears at Amazon, Google.",
    taggedConcepts: ["graphs", "graph_traversal_dfs", "graph_traversal_bfs"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-merge-k-sorted",
    categoryId: "dsa",
    title: "Merge K Sorted Lists",
    body: "Given an array of k sorted linked lists, merge them into a single sorted linked list.",
    source: "Public canonical; Hard tier; appears at Facebook, Google.",
    taggedConcepts: ["heaps", "priority_queue", "linked_lists"],
    difficulty: "hard",
    addedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "q-coin-change",
    categoryId: "dsa",
    title: "Minimum Coins for Amount (canonical: Coin Change)",
    body: "Given coin denominations and a target amount, return the minimum number of coins needed to make the amount, or -1 if impossible.",
    source: "Public canonical; common at Amazon, Microsoft.",
    taggedConcepts: ["dynamic_programming_1d"],
    difficulty: "medium",
    addedAt: "2026-01-10T08:00:00Z"
  }
];
```

---

## 4. Prompts (`prompts.ts`)

All eleven distinct prompts (generation, concept_extraction, 6 eval_judge, difficulty_assessor) as active versions, plus two prior versions of the generation prompt for version history.

```ts
import type { PromptVersion } from "../../types";

// --- Generation prompt, current v3 ---
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
4. The problem.statement must NOT be a substring or close paraphrase of any corpus excerpt. If you draw inspiration from a corpus item, change the scenario/domain meaningfully and record it in metadata.sourceInspirations.
5. The referenceSolution MUST pass all testCases when executed. This will be verified by code execution.
6. testCases must include at least 2 "sample" cases (visible) and 4 "hidden" cases. Hidden cases must cover: empty/minimal input, single-element edge case, boundary values, worst-case complexity input.
7. rubric.evaluationDimensions must include at least one dimension per primary_concept that explicitly assesses correct application of that concept.

QUALITY EXPECTATIONS:
- The scenario should be a plausible engineering or real-world problem, not a textbook contrivance.
- Constraints must be specific (concrete input ranges, time/memory limits).
- The reference solution should be the canonical efficient solution and reach the stated complexity exactly.
- Provide a brute force solution when an efficient one exists; brute force is useful for verification.

Think step by step. Output only the JSON.`;

// --- Generation prompt, prior version v2 (kept for history) ---
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

// --- Generation prompt, oldest version v1 ---
const GENERATION_V1 = `You generate DSA assignments. Given the inputs, write a problem with examples, a solution, and 5 test cases. Output JSON.`;

// --- Concept extraction prompt ---
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
  "extracted": [{ "conceptId": string, "depth": "mastered"|"applied"|"introduced", "confidence": number (0-1), "evidence": string (short quote or paraphrase from the input) }],
  "proposedNewConcepts": [{ "suggestedName": string, "rationale": string, "evidence": string }]
}

Rules:
- Use the exact conceptId strings from the taxonomy.
- Only include concepts with clear textual evidence in the input.
- Do not invent conceptIds; if a topic was clearly taught but doesn't exist in the taxonomy, add to proposedNewConcepts instead.
- Be conservative with confidence: 0.95+ requires explicit and unambiguous evidence.`;

// --- Eval Judge prompts (one per dimension) ---
const JUDGE_TEMPLATE = (dimensionName: string, definition: string, anchors: { 1: string; 3: string; 5: string }) => `You are evaluating a generated DSA assignment on ONE specific dimension: ${dimensionName}.

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

Do not consider any dimension other than ${dimensionName}. Be strict but fair. Use the full range. A score of 5 requires excellence; 1 requires fundamental failure.`;

const JUDGE_PROBLEM_CLARITY = JUDGE_TEMPLATE(
  "Problem Clarity",
  "Is the problem statement unambiguous? Are input and output formats precise? Are constraints (ranges, sizes, limits) explicit and consistent?",
  {
    5: "Statement is crystal clear, input/output formats fully specified, all constraints explicit and internally consistent. A learner reading it cannot reasonably misinterpret.",
    3: "Statement is mostly clear but at least one ambiguity exists (unspecified type, missing range, unclear edge case). A careful learner could still solve it.",
    1: "Statement is fundamentally ambiguous, contradictory, or missing critical information."
  }
);

const JUDGE_TEST_CASE_COVERAGE = JUDGE_TEMPLATE(
  "Test Case Coverage",
  "Do the test cases (especially hidden ones) adequately cover edge cases for the concepts being tested? Empty input, single element, boundary values, worst-case complexity input?",
  {
    5: "Test cases comprehensively cover empty/minimal input, single-element, boundary values, and worst-case complexity. Each case has clear rationale.",
    3: "Most edge cases covered; one important edge case is missing or weakly tested.",
    1: "Test cases cover only the happy path; critical edge cases are absent."
  }
);

const JUDGE_COMPLEXITY_CORRECTNESS = JUDGE_TEMPLATE(
  "Complexity Correctness",
  "Does the reference solution actually achieve the claimed time and space complexity? If a brute force is provided, does it differ meaningfully (typically by an order of magnitude)?",
  {
    5: "Reference solution achieves the claimed complexity precisely. Brute force, if provided, is meaningfully less efficient and useful for differential verification.",
    3: "Reference solution achieves stated complexity but the claim is loose (e.g., O(n) stated, actually O(n log n)); or brute force is only marginally different.",
    1: "Reference solution does NOT achieve the claimed complexity, or claim is misleadingly stated."
  }
);

const JUDGE_CONCEPT_RUBRIC_ALIGNMENT = JUDGE_TEMPLATE(
  "Concept-Rubric Alignment",
  "Does the rubric actually grade the concepts the problem requires the learner to apply? Does each rubric dimension correspond to evidence the learner's submission would surface?",
  {
    5: "Every primary concept has at least one corresponding rubric dimension that grades correct application. Anchors describe observable evidence. No dimension grades something the problem doesn't require.",
    3: "Most concepts have rubric coverage but at least one primary concept is missing or one dimension grades something tangential.",
    1: "Rubric and problem are misaligned: the rubric grades different concepts than the problem requires, or the dimensions are vague enough to be ungradable."
  }
);

const JUDGE_REAL_WORLD_FIDELITY = JUDGE_TEMPLATE(
  "Real-World Fidelity",
  "Is the scenario plausibly something an engineer might encounter, or is it a textbook contrivance? A senior engineer should recognize the underlying problem as something they have actually solved.",
  {
    5: "Scenario is recognizably real: the constraints and stakes mirror an actual engineering situation. A senior engineer would say 'yes, I have built something like this.'",
    3: "Scenario is acceptable but generic; could be from any tutorial. Real-world veneer is thin.",
    1: "Scenario is purely contrived ('given an array of integers...'). No attempt at engineering grounding."
  }
);

const JUDGE_NOVELTY = JUDGE_TEMPLATE(
  "Novelty",
  "Is this distinguishable from canonical interview questions (Two Sum, Valid Parens, etc.), or a thin rename? A learner who has prepared with canonical questions should not be able to solve this by pattern-match alone.",
  {
    5: "Genuinely novel framing or twist. A learner familiar with canonical interview questions will need to think, not pattern-match. The novelty does not obscure the underlying concept.",
    3: "Recognizable canonical problem with cosmetic changes (renamed variables, different domain). A prepared learner will solve quickly but at least has to map.",
    1: "Verbatim or near-verbatim canonical problem. A learner who has seen the canonical version answers from memory."
  }
);

export const DSA_PROMPTS: PromptVersion[] = [
  // Generation prompt with version history
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
  // Concept extraction
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
  // Eval Judge — one per dimension
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
  // Difficulty assessor (independent cross-check)
  {
    id: "prompt-difficulty-v1",
    promptType: "difficulty_assessor",
    categoryId: "dsa",
    version: 1,
    body: `You are independently assessing the difficulty of a DSA problem. You do not know what the author claimed about difficulty.

PROBLEM STATEMENT AND CONSTRAINTS:
{{problem_statement_and_constraints}}

REFERENCE SOLUTION:
{{reference_solution}}

Rate the problem on these four axes:
- conceptual_difficulty (1-5): 1 = single basic concept applied directly; 5 = multi-concept integration with non-obvious insight needed
- implementation_difficulty (1-5): 1 = under 20 lines straightforward; 5 = intricate code with many edge cases and pointer/index manipulation
- estimated_solve_time_minutes (integer): time for a competent learner who has been taught the relevant concepts
- distinct_concepts_required (integer): count of distinct algorithmic concepts the solution requires

Return ONLY JSON:
{ "conceptual_difficulty": int, "implementation_difficulty": int, "estimated_solve_time_minutes": int, "distinct_concepts_required": int, "reasoning": "2-3 sentence justification" }`,
    createdBy: "user-admin-1",
    createdAt: "2026-01-08T10:00:00Z",
    active: true
  }
];
```

---

(Continues in part 2 — gold set, example assignments, prompt and concept proposals)

<!-- Part 2 boundary -->

## 5. Gold set (`goldSet.ts`)

Ten hand-authored DSA assignments. Each is a complete reference exemplar: full problem statement, reference solution, brute force, six test cases (two visible, four hidden), rubric, metadata, and reasoning trace.

These are inspired by canonical interview patterns but originally framed; they are what the authoring pipeline tries to produce — and what the leakage check ensures pipeline output does not directly copy from the corpus.

```ts
import type { GoldSetEntry } from "../../types";

// Shared version stamp for all hand-authored gold entries
const GOLD_VERSIONS = {
  pipelineVersion: "manual:gold-set:1.0",
  promptVersion: "manual",
  judgeVersion: "manual",
  taxonomyVersion: 1,
  goldSetVersion: 1
};

// Helper for human ratings on the 5-point Eval Judge scale
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

export const DSA_GOLD_SET: GoldSetEntry[] = [

  // ===== Entry 1: hashmap + frequency_counting =====
  {
    id: "gold-001",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: {
        primary: ["hashmaps", "frequency_counting"],
        secondary: ["arrays"],
        mustNotRequire: ["dynamic_programming_1d", "dynamic_programming_2d", "graphs"]
      },
      difficultyTarget: {
        tier: "medium",
        expectedSolveTimeMinutes: 25,
        expectedConceptCount: 2,
        constraintComplexity: "moderate"
      },
      assignmentType: "coding_problem",
      realWorldAnchor: {
        domain: "observability",
        avoidOverused: ["two_sum", "fizzbuzz"]
      },
      corpusSliceIds: ["q-two-sum", "q-group-anagrams"]
    },
    output: {
      id: "gold-001-output",
      request: undefined as any, // back-reference filled by loader
      problem: {
        title: "First Recurring Error Code in a Service Log",
        statement: `A production service emits a stream of integer error codes during a deploy window. The on-call engineer needs to know the **first error code that recurs** so that root-cause analysis can begin with the right signal.

Given an array \`error_codes\` representing the chronologically ordered stream of error codes, return the first error code that appears more than once. If no error code recurs, return \`-1\`.

"First recurring" means: the error code whose **second occurrence** has the smallest index in the array.`,
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
            explanation: "The codes that recur are 503 (second occurrence at index 3), 400 (second occurrence at index 4), and 404 (second occurrence at index 6). The earliest second-occurrence is 503's, at index 3."
          },
          {
            input: "5\n100 200 300 400 500",
            output: "-1",
            explanation: "No code repeats."
          }
        ]
      },
      starterCode: [
        {
          language: "python",
          code: `def first_recurring_error(error_codes: list[int]) -> int:
    # Your implementation here
    pass

if __name__ == "__main__":
    n = int(input())
    codes = list(map(int, input().split()))
    print(first_recurring_error(codes))`
        }
      ],
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
        { id: "tc1", input: "7\n400 503 404 503 400 502 404", expectedOutput: "503", visibility: "sample", rationale: "Standard case with multiple recurrences; correct answer is first second-occurrence." },
        { id: "tc2", input: "5\n100 200 300 400 500", expectedOutput: "-1", visibility: "sample", rationale: "No recurrence — must return -1." },
        { id: "tc3", input: "1\n42", expectedOutput: "-1", visibility: "hidden", rationale: "Single element — cannot recur." },
        { id: "tc4", input: "2\n7 7", expectedOutput: "7", visibility: "hidden", rationale: "Minimal recurrence at indices 0,1." },
        { id: "tc5", input: "6\n-1 -2 -1 -2 0 0", expectedOutput: "-1", visibility: "hidden", rationale: "Negative codes; correct answer requires negative-key handling." },
        { id: "tc6", input: "100000\n" + Array.from({ length: 99999 }, (_, i) => String(i)).join(" ") + " 0", expectedOutput: "0", visibility: "hidden", rationale: "Worst case n=10^5 with the recurrence at the very end — exercises O(n) requirement; brute force would TLE." }
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
            evidenceRequired: "Solution passes tc6 (10^5 input) within time limit"
          }
        ],
        conceptsBeingAssessed: ["hashmaps", "frequency_counting"],
        redFlags: ["uses nested loops with no hashmap", "sorts the input (loses ordering required by problem)", "uses Counter and looks at counts (misinterprets 'first')"]
      },
      metadata: {
        conceptsRequired: ["hashmaps", "frequency_counting", "arrays"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.35,
        estimatedSolveTimeMinutes: 25,
        realWorldDomain: "observability",
        noveltyHash: "h-recur-err-001a",
        sourceInspirations: [
          { corpusId: "q-two-sum", similarity: 0.32 }
        ]
      },
      reasoningTrace: {
        conceptSelectionRationale: "Targets hashmap + frequency tracking as primary; the 'first recurring' twist forces single-pass with set rather than full Counter, exercising the lookup-while-iterating idiom.",
        scenarioSelectionRationale: "Observability/log analysis is a recognizable engineering scenario; integers as error codes ground the abstract array naturally without requiring domain knowledge.",
        difficultyCalibrationRationale: "Single-concept primary with a small semantic twist ('first second-occurrence') keeps this at medium-easy; appropriate as first hands-on assignment after the hash-lookup module.",
        deviationsFromCorpus: "Inspired by Two Sum's hash-lookup pattern but the 'first to recur' semantics is materially different from sum-based queries."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T11:00:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T11:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 2: two_pointers =====
  {
    id: "gold-002",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: {
        primary: ["two_pointers"],
        secondary: ["sorting", "arrays"],
        mustNotRequire: ["dynamic_programming_1d", "heaps", "graphs"]
      },
      difficultyTarget: {
        tier: "medium",
        expectedSolveTimeMinutes: 35,
        expectedConceptCount: 2,
        constraintComplexity: "moderate"
      },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "logistics", avoidOverused: ["three_sum"] },
      corpusSliceIds: ["q-three-sum"]
    },
    output: {
      id: "gold-002-output",
      request: undefined as any,
      problem: {
        title: "Pair of Packages Closest to Truck Capacity",
        statement: `A delivery truck has a fixed weight capacity \`C\`. A warehouse maintains a list of package weights, and the dispatcher wants to load exactly two packages whose combined weight is as close to \`C\` as possible **without exceeding it**.

Given an array \`weights\` of package weights and the truck capacity \`C\`, return the maximum combined weight of any two distinct packages that is ≤ \`C\`. If no such pair exists, return \`-1\`.

Two packages must be at different indices; you may not use the same package twice.`,
        inputFormat: "First line: integers n and C (2 ≤ n ≤ 10^5; 1 ≤ C ≤ 10^9). Second line: n space-separated integers, each in [1, 10^9], representing weights.",
        outputFormat: "A single integer: the max combined weight ≤ C, or -1.",
        constraints: [
          "2 ≤ n ≤ 100,000",
          "1 ≤ C ≤ 10^9",
          "1 ≤ weight_i ≤ 10^9",
          "Time limit: 2 seconds"
        ],
        examples: [
          { input: "5 50\n10 20 30 40 25", output: "50", explanation: "20 + 30 = 50, exactly capacity." },
          { input: "4 10\n7 8 9 11", output: "-1", explanation: "Minimum pair sum is 7+8=15, which exceeds 10." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def closest_pair_weight(weights: list[int], capacity: int) -> int:
    # Your implementation here
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
        { id: "tc5", input: "6 100\n50 50 50 50 50 50", expectedOutput: "100", visibility: "hidden", rationale: "Duplicates — must use two distinct indices, not the same element twice." },
        { id: "tc6", input: "100000 1000000000\n" + Array.from({length: 100000}, (_, i) => String(i + 1)).join(" "), expectedOutput: "199999", visibility: "hidden", rationale: "Worst-case n=10^5 sorted; brute force would TLE; tests O(n log n) requirement." }
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
              5: "Pointer condition is left < right; never uses the same index twice. tc5 passes.",
              3: "Handles distinctness in most cases but has off-by-one or loop-bound issue.",
              1: "Permits same-index pair (e.g., uses single weight twice when it matches capacity)."
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
              1: "O(n²) or worse — fails tc6."
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
        deviationsFromCorpus: "Inspired by 3Sum (two-pointer on sorted) but constrained to pairs and bounded by capacity rather than exact-zero — different objective function."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T11:30:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T11:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 3: sliding_window =====
  {
    id: "gold-003",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: {
        primary: ["sliding_window"],
        secondary: ["arrays"],
        mustNotRequire: ["heaps", "dynamic_programming_1d"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "infrastructure", avoidOverused: ["max_average_subarray"] },
      corpusSliceIds: ["q-longest-unique-substring"]
    },
    output: {
      id: "gold-003-output",
      request: undefined as any,
      problem: {
        title: "Peak Sustained Request Rate",
        statement: `A reverse proxy emits a per-second log of request counts. The infra team wants to know: **what is the highest sustained average request rate over any contiguous K-second window?** This metric drives autoscaling thresholds.

Given an array \`rates\` of length n where \`rates[i]\` is requests-per-second at second \`i\`, and an integer \`K\`, return the maximum average over any contiguous window of length exactly K. Output as a single decimal with five places of precision.`,
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
        { id: "tc4", input: "5 5\n1 2 3 4 5", expectedOutput: "3.00000", visibility: "hidden", rationale: "Window equals array length — single window." },
        { id: "tc5", input: "6 2\n0 0 0 1000000 0 0", expectedOutput: "500000.00000", visibility: "hidden", rationale: "Spike value; tests sliding subtraction precision." },
        { id: "tc6", input: "100000 100\n" + Array.from({length:100000},(_,i)=>String(i%1000)).join(" "), expectedOutput: "949.50000", visibility: "hidden", rationale: "Worst case n=10^5; brute force is O(n*k)=10^7, borderline. O(n) sliding window must hold." }
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
              5: "Exactly 5 decimal places; uses division-by-k at the end, not per-step.",
              3: "Correct value but wrong format (e.g., 6 decimal places).",
              1: "Wrong value due to integer division or premature rounding."
            },
            evidenceRequired: "Output matches expected format exactly"
          },
          {
            dimension: "Complexity",
            weight: 0.2,
            anchors: {
              5: "O(n) time, O(1) extra space.",
              3: "O(n*k) — passes small cases but tc6 may time out.",
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
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T12:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 4: dynamic_programming_1d =====
  {
    id: "gold-004",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing", // DP intro happens later but we'll keep DP entries paired with a DP class context in the real curriculum; for the seed, this entry uses a higher module context.
      targetConcepts: {
        primary: ["dynamic_programming_1d"],
        secondary: ["arrays", "recursion"],
        mustNotRequire: ["graphs", "heaps"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "advertising", avoidOverused: ["house_robber"] },
      corpusSliceIds: ["q-word-break", "q-coin-change"]
    },
    output: {
      id: "gold-004-output",
      request: undefined as any,
      problem: {
        title: "Maximum Revenue from Non-Adjacent Ad Slots",
        statement: `An ad network sells slots in a sequence of TV breaks. To prevent ad fatigue, the system enforces that **no two adjacent breaks** can be sold to the same campaign. Given an array \`revenue\` where \`revenue[i]\` is the revenue from selling slot \`i\` to your campaign, choose a subset of slots with **no two adjacent** that **maximizes total revenue**.

Return the maximum total revenue achievable.`,
        inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Second line: n space-separated integers, each in [0, 10^6].",
        outputFormat: "A single integer: maximum revenue.",
        constraints: ["1 ≤ n ≤ 100,000", "0 ≤ revenue[i] ≤ 10^6"],
        examples: [
          { input: "5\n3 2 7 10 1", output: "13", explanation: "Choose slots 0, 2, 4 → 3+7+1=11; or 0,3 → 3+10=13; or 2,4 → 7+1=8. Best is 13." },
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
        { id: "tc6", input: "100000\n" + Array.from({length:100000},(_,i)=>String(i%100)).join(" "), expectedOutput: "2475000", visibility: "hidden", rationale: "Worst case; O(n) required; recursive brute force would stack overflow / TLE." }
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
        difficultyCalibrationRationale: "Medium-high: requires recognizing DP pattern and correctly handling adjacency. Bottom-up with O(1) space is the polished form learners should reach.",
        deviationsFromCorpus: "Coin Change is 1D DP but the recurrence is different (unbounded selection vs. adjacency constraint)."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T12:30:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T12:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 5: tree_traversal_dfs + binary_search_tree =====
  {
    id: "gold-005",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion",
      targetConcepts: {
        primary: ["tree_traversal_dfs", "binary_search_tree"],
        secondary: ["recursion"],
        mustNotRequire: ["dynamic_programming_1d", "heaps"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "pricing", avoidOverused: ["validate_bst"] },
      corpusSliceIds: ["q-binary-tree-inorder"]
    },
    output: {
      id: "gold-005-output",
      request: undefined as any,
      problem: {
        title: "Sum of Product Prices in a Range",
        statement: `A pricing service stores product prices in a binary search tree keyed by price. Given the **root** of a BST and a price range \`[lo, hi]\` (inclusive), return the sum of all prices that fall within the range.

The BST property holds: every node's left subtree contains prices strictly less than the node's value, and the right subtree strictly greater. Use the BST property to prune your traversal — do not visit every node.`,
        inputFormat: `First line: integers n, lo, hi (1 ≤ n ≤ 10^5; -10^9 ≤ lo ≤ hi ≤ 10^9).
Next n lines: each line "val left_idx right_idx" giving a node's value and the 0-indexed positions of its left and right children (or -1 if absent). Node 0 is the root.`,
        outputFormat: "A single integer: sum of values in [lo, hi].",
        constraints: ["1 ≤ n ≤ 100,000", "Tree is a valid BST", "Time: 2 seconds"],
        examples: [
          {
            input: "5 7 15\n10 1 2\n5 3 -1\n15 4 -1\n3 -1 -1\n12 -1 -1",
            output: "37",
            explanation: "Tree: 10 with left=5 (left=3) and right=15 (left=12). Values in [7,15] are 10, 12, 15 → sum 37."
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
    __slots__ = ("val", "left", "right")
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def build(rows):
    nodes = [Node(r[0]) for r in rows]
    for i, (_, l, r) in enumerate(rows):
        if l != -1: nodes[i].left = nodes[l]
        if r != -1: nodes[i].right = nodes[r]
    return nodes[0] if nodes else None

def range_sum(root, lo, hi):
    pass

if __name__ == "__main__":
    n, lo, hi = map(int, input().split())
    rows = [tuple(map(int, input().split())) for _ in range(n)]
    print(range_sum(build(rows), lo, hi))`
      }],
      referenceSolution: {
        language: "python",
        code: `import sys
sys.setrecursionlimit(200000)

class Node:
    __slots__ = ("val", "left", "right")
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
        complexityTime: "O(n) worst case, but O(log n + k) for balanced BST with k matching nodes",
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
        { id: "tc6", input: "100000 50000 60000\n" + Array.from({length:100000}, (_,i) => i===0 ? `${i} ${i+1===100000?-1:1} -1` : `${i} ${i+1===100000?-1:i+1} -1`).join("\n"), expectedOutput: "552555000", visibility: "hidden", rationale: "Skewed BST n=10^5, narrow range; tests pruning. Without pruning, would touch every node — within budget but pruning makes it much faster." }
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
        difficultyCalibrationRationale: "Medium: traversal is standard, pruning is the discriminator. A non-pruning solution works for small inputs but fails to demonstrate BST understanding.",
        deviationsFromCorpus: "Inorder traversal is unconditional; this problem requires conditional pruning, fundamentally different objective."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T13:00:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T13:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 6: heaps + priority_queue + frequency_counting =====
  {
    id: "gold-006",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-heaps-and-stacks",
      targetConcepts: {
        primary: ["heaps", "priority_queue", "frequency_counting"],
        secondary: ["hashmaps"],
        mustNotRequire: ["dynamic_programming_1d", "graphs"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 3, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "inventory", avoidOverused: ["top_k_frequent_elements"] },
      corpusSliceIds: ["q-kth-largest", "q-group-anagrams"]
    },
    output: {
      id: "gold-006-output",
      request: undefined as any,
      problem: {
        title: "Top K Best-Selling SKUs from a Day's Orders",
        statement: `An order-processing system emits a stream of order events, each containing a SKU (product identifier). At end-of-day, the merchandising team wants the **K SKUs that appear in the most orders**. If multiple SKUs tie for the Kth position, return the one with the smaller SKU value (treat SKUs as integers).

Return the K SKUs in descending order of frequency. Within the same frequency, smaller SKU comes first.`,
        inputFormat: "First line: integers n and K (1 ≤ K ≤ n ≤ 10^5). Second line: n space-separated integer SKUs, each in [1, 10^9].",
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
    # Min-heap of size k; key = (count, -sku) so we evict lowest count, and on tie the larger sku.
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
        { id: "tc6", input: "100000 100\n" + Array.from({length:100000}, (_,i) => String(i % 1000 + 1)).join(" "), expectedOutput: Array.from({length:100}, (_,i) => String(i + 1)).join(" "), visibility: "hidden", rationale: "Scale test with deterministic distribution; tests heap-based O(u log k) over O(u log u) sort." }
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
              5: "Maintains a min-heap of size k; pushes/replaces in O(log k). Justifies why this beats sort for u >> k.",
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
        difficultyCalibrationRationale: "Medium-high: three concepts working together. Tie-breaking is the discriminator that separates correct solutions from approximate ones.",
        deviationsFromCorpus: "Kth-largest gives a single value; this requires the full top-K with deterministic tie-breaking — different output structure and ordering challenge."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T13:30:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T13:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 7: graph_traversal_bfs =====
  {
    id: "gold-007",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion", // graphs taught later; for seed, this references trees-and-recursion which establishes BFS via tree level-order
      targetConcepts: {
        primary: ["graph_traversal_bfs"],
        secondary: ["graphs", "queues"],
        mustNotRequire: ["dynamic_programming_1d", "heaps"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "social_network", avoidOverused: ["number_of_islands"] },
      corpusSliceIds: ["q-num-islands"]
    },
    output: {
      id: "gold-007-output",
      request: undefined as any,
      problem: {
        title: "Minimum Introductions to Reach a Target Person",
        statement: `A professional networking platform represents connections as an undirected graph: users are nodes, mutual connections are edges. Given a source user \`s\` and a target user \`t\`, return the **minimum number of introductions** needed to connect \`s\` to \`t\` through their network. If they're already connected directly, the answer is 1. If they're the same person, return 0. If they cannot be connected at all, return -1.`,
        inputFormat: `First line: integers n, m, s, t (1 ≤ n ≤ 10^5; 0 ≤ m ≤ 2×10^5). Next m lines: each "u v" describing an edge.`,
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
      bruteForceSolution: null,
      testCases: [
        { id: "tc1", input: "6 5 0 5\n0 1\n1 2\n2 3\n3 5\n4 5", expectedOutput: "4", visibility: "sample", rationale: "Standard path through chain." },
        { id: "tc2", input: "3 1 0 2\n0 1", expectedOutput: "-1", visibility: "sample", rationale: "Disconnected." },
        { id: "tc3", input: "1 0 0 0", expectedOutput: "0", visibility: "hidden", rationale: "Source equals target." },
        { id: "tc4", input: "2 1 0 1\n0 1", expectedOutput: "1", visibility: "hidden", rationale: "Direct connection." },
        { id: "tc5", input: "4 4 0 3\n0 1\n0 2\n1 3\n2 3", expectedOutput: "2", visibility: "hidden", rationale: "Multiple paths; BFS finds shortest." },
        { id: "tc6", input: "100000 199999 0 99999\n" + Array.from({length:99999}, (_,i) => `${i} ${i+1}`).join("\n") + "\n0 99999", expectedOutput: "1", visibility: "hidden", rationale: "Large chain with shortcut at end; tests BFS shortest-first behavior, not DFS." }
      ],
      rubric: {
        evaluationDimensions: [
          {
            dimension: "Correct BFS for shortest path",
            weight: 0.5,
            anchors: {
              5: "Uses queue, visits in level order with visited set; returns at first encounter of target.",
              3: "Uses BFS structurally but tracks distance via wrong field, or marks visited at dequeue instead of enqueue (slower).",
              1: "Uses DFS or Dijkstra-style with priorities (overkill / wrong)."
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
        deviationsFromCorpus: "Number-of-islands is grid-based BFS with connected-component counting; this is path-finding on a general graph — different objective."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T14:00:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T14:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 8: monotonic_stack =====
  {
    id: "gold-008",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-heaps-and-stacks",
      targetConcepts: {
        primary: ["monotonic_stack"],
        secondary: ["stacks", "arrays"],
        mustNotRequire: ["dynamic_programming_1d", "heaps"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 40, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "trading", avoidOverused: ["daily_temperatures"] },
      corpusSliceIds: []
    },
    output: {
      id: "gold-008-output",
      request: undefined as any,
      problem: {
        title: "Days Until Next Price Drop",
        statement: `A trading dashboard tracks the closing price of a security for n consecutive trading days. For each day, the analyst wants to know: **how many days until a strictly lower closing price appears**? If no future day has a strictly lower price, output 0 for that day.

Given an array \`prices\` of closing prices, return an array \`days\` of the same length where \`days[i]\` is the number of trading days until a price lower than \`prices[i]\` is observed.`,
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
    stack = []  # indices with strictly increasing prices? No — we want to pop when we see a lower price.
    # Pattern: monotonic stack of indices with prices in non-increasing order? Reconsider:
    # We want, for each i, the next j > i with prices[j] < prices[i].
    # Maintain a stack of indices whose "next lower" hasn't been found yet.
    # When we see prices[i], pop all stack tops where prices[top] > prices[i] and record res[top] = i - top.
    for i, p in enumerate(prices):
        while stack and prices[stack[-1]] > p:
            top = stack.pop()
            res[top] = i - top
        stack.append(i)
    # Remaining stack entries have no lower price; res stays 0.
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
    n = len(prices)
    res = [0]*n
    for i in range(n):
        for j in range(i+1, n):
            if prices[j] < prices[i]:
                res[i] = j - i
                break
    return res`
      },
      testCases: [
        { id: "tc1", input: "6\n100 105 102 99 110 108", expectedOutput: "3 2 1 0 1 0", visibility: "sample", rationale: "Mixed; tests forward scan with multiple drops." },
        { id: "tc2", input: "4\n10 9 8 7", expectedOutput: "1 1 1 0", visibility: "sample", rationale: "Strictly decreasing." },
        { id: "tc3", input: "1\n50", expectedOutput: "0", visibility: "hidden", rationale: "Single day." },
        { id: "tc4", input: "4\n5 5 5 5", expectedOutput: "0 0 0 0", visibility: "hidden", rationale: "All equal — 'strictly lower' never triggers." },
        { id: "tc5", input: "4\n1 2 3 4", expectedOutput: "0 0 0 0", visibility: "hidden", rationale: "Strictly increasing — no lower." },
        { id: "tc6", input: "100000\n" + Array.from({length:100000}, (_,i) => String(100000 - i)).join(" "), expectedOutput: Array.from({length:99999}, () => "1").join(" ") + " 0", visibility: "hidden", rationale: "Worst case for brute force (O(n²) = 10^10); only O(n) passes." }
      ],
      rubric: {
        evaluationDimensions: [
          {
            dimension: "Monotonic stack technique",
            weight: 0.5,
            anchors: {
              5: "Single pass with a stack of indices; pops on strict decrease and records distance.",
              3: "Uses a stack but not monotonically — extra checks degrade to O(n²).",
              1: "Uses nested loops; no stack."
            },
            evidenceRequired: "While-loop pop pattern inside outer for-loop"
          },
          {
            dimension: "Strict-vs-non-strict comparison",
            weight: 0.2,
            anchors: {
              5: "Pops when prices[top] > current (strict). Equal prices stay on stack.",
              3: "Uses >= instead of >, giving wrong answer on tc4.",
              1: "Wrong comparison direction."
            },
            evidenceRequired: "Passes tc4 (all-equal case)"
          },
          {
            dimension: "Output for never-decreasing entries",
            weight: 0.2,
            anchors: {
              5: "Entries left on stack at end remain 0 in output.",
              3: "Sets remaining to -1 or some wrong sentinel.",
              1: "Crashes or wrong values for never-resolved entries."
            },
            evidenceRequired: "Passes tc5 (strictly increasing)"
          },
          {
            dimension: "Complexity",
            weight: 0.1,
            anchors: {
              5: "O(n) — each index pushed and popped at most once. Passes tc6.",
              3: "O(n²) brute force — passes small, fails tc6.",
              1: "Worse than O(n²)."
            },
            evidenceRequired: "Passes tc6"
          }
        ],
        conceptsBeingAssessed: ["monotonic_stack", "stacks"],
        redFlags: ["uses nested loops with no stack", "uses heap (wrong DS for this)"]
      },
      metadata: {
        conceptsRequired: ["monotonic_stack", "stacks", "arrays"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.6,
        estimatedSolveTimeMinutes: 40,
        realWorldDomain: "trading",
        noveltyHash: "h-next-drop-008",
        sourceInspirations: []
      },
      reasoningTrace: {
        conceptSelectionRationale: "Monotonic stack is the discriminating technique; trading-prices framing presents it as next-lower-element variant naturally.",
        scenarioSelectionRationale: "Trading-day analysis is a recognizable financial-engineering scenario.",
        difficultyCalibrationRationale: "Medium-high: technique is non-obvious for first-time learners; strict-vs-non-strict comparison and never-decreasing handling separate strong from weak solutions.",
        deviationsFromCorpus: "Variant of daily-temperatures pattern but with strict-less-than condition; all-equal case is an explicit discriminator."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T14:30:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T14:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 9: binary_search =====
  {
    id: "gold-009",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: {
        primary: ["binary_search"],
        secondary: ["arrays"],
        mustNotRequire: ["dynamic_programming_1d", "graphs", "heaps"]
      },
      difficultyTarget: { tier: "easy", expectedSolveTimeMinutes: 20, expectedConceptCount: 1, constraintComplexity: "few" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "logging", avoidOverused: ["search_in_sorted_array"] },
      corpusSliceIds: []
    },
    output: {
      id: "gold-009-output",
      request: undefined as any,
      problem: {
        title: "Insertion Index in a Sorted Event Log",
        statement: `An append-only event log stores Unix timestamps in non-decreasing order. When a delayed event arrives (with timestamp \`t\`), the system needs to insert it at the **earliest position that keeps the log sorted**. If an entry with the same timestamp already exists, the new event should be inserted **before** the first such entry (to preserve fairness for in-order arrivals).

Return the 0-indexed insertion position.`,
        inputFormat: "First line: integers n and t (0 ≤ n ≤ 10^6; 0 ≤ t ≤ 10^18). Second line: n space-separated non-decreasing integers, each in [0, 10^18]. (If n=0, second line is empty.)",
        outputFormat: "A single integer: insertion index.",
        constraints: ["0 ≤ n ≤ 1,000,000", "Time limit: 1 second"],
        examples: [
          { input: "5 12\n5 8 12 12 20", output: "2", explanation: "Insert before first 12, at index 2." },
          { input: "4 100\n5 8 12 20", output: "4", explanation: "Larger than all; append at end." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def insertion_index(log: list[int], t: int) -> int:
    pass

if __name__ == "__main__":
    n, t = map(int, input().split())
    log = list(map(int, input().split())) if n > 0 else []
    print(insertion_index(log, t))`
      }],
      referenceSolution: {
        language: "python",
        code: `def insertion_index(log, t):
    lo, hi = 0, len(log)
    while lo < hi:
        mid = (lo + hi) // 2
        if log[mid] < t:
            lo = mid + 1
        else:
            hi = mid
    return lo

if __name__ == "__main__":
    n, t = map(int, input().split())
    log = list(map(int, input().split())) if n > 0 else []
    print(insertion_index(log, t))`,
        complexityTime: "O(log n)",
        complexitySpace: "O(1)"
      },
      bruteForceSolution: {
        language: "python",
        code: `def insertion_index(log, t):
    for i, v in enumerate(log):
        if v >= t:
            return i
    return len(log)`
      },
      testCases: [
        { id: "tc1", input: "5 12\n5 8 12 12 20", expectedOutput: "2", visibility: "sample", rationale: "Insert before duplicates." },
        { id: "tc2", input: "4 100\n5 8 12 20", expectedOutput: "4", visibility: "sample", rationale: "Append at end." },
        { id: "tc3", input: "0 50\n", expectedOutput: "0", visibility: "hidden", rationale: "Empty log; insertion at index 0." },
        { id: "tc4", input: "1 5\n10", expectedOutput: "0", visibility: "hidden", rationale: "Insert before single existing." },
        { id: "tc5", input: "3 5\n5 5 5", expectedOutput: "0", visibility: "hidden", rationale: "All equal; insert before all." },
        { id: "tc6", input: "1000000 500000000000000000\n" + Array.from({length:1000000}, (_,i) => String(i*1000000000)).join(" "), expectedOutput: "500000", visibility: "hidden", rationale: "Scale test n=10^6; O(n) brute force would TLE within 1s. O(log n) easily passes." }
      ],
      rubric: {
        evaluationDimensions: [
          {
            dimension: "Correct binary search bounds",
            weight: 0.5,
            anchors: {
              5: "Uses [lo, hi) half-open interval with hi=len initially; correct mid update. Terminates with lo==hi.",
              3: "Has off-by-one but still converges; or uses inclusive interval with extra care needed.",
              1: "Wrong loop invariants; infinite loop or off-by-multiple."
            },
            evidenceRequired: "Loop terminates; mid computed; lo/hi updated"
          },
          {
            dimension: "Lower-bound vs upper-bound semantics",
            weight: 0.3,
            anchors: {
              5: "Returns lower-bound (first index where log[i] >= t).",
              3: "Returns some valid index but wrong semantics (upper-bound).",
              1: "Returns wrong position consistently."
            },
            evidenceRequired: "Passes tc1, tc5 (which depend on lower-bound)"
          },
          {
            dimension: "Edge cases (empty, single, append)",
            weight: 0.1,
            anchors: {
              5: "Empty log → 0; single-element handled; append-at-end handled.",
              3: "One edge fails.",
              1: "Multiple edges fail."
            },
            evidenceRequired: "Passes tc3, tc4, tc2"
          },
          {
            dimension: "Complexity",
            weight: 0.1,
            anchors: {
              5: "O(log n); passes tc6.",
              3: "O(n) linear scan — works on small, fails tc6.",
              1: "Worse."
            },
            evidenceRequired: "Passes tc6 within 1s"
          }
        ],
        conceptsBeingAssessed: ["binary_search"],
        redFlags: ["uses linear scan", "fails on tc5 (returns wrong index for all-equal)"]
      },
      metadata: {
        conceptsRequired: ["binary_search", "arrays"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.3,
        estimatedSolveTimeMinutes: 20,
        realWorldDomain: "logging",
        noveltyHash: "h-ins-idx-009",
        sourceInspirations: []
      },
      reasoningTrace: {
        conceptSelectionRationale: "Lower-bound binary search; logs framing motivates the strict 'before first equal' semantics.",
        scenarioSelectionRationale: "Append-only logs with out-of-order arrivals is a real distributed-systems concern (especially in event sourcing).",
        difficultyCalibrationRationale: "Easy-medium: technique well known, but lower-bound semantics often confused with upper-bound; tc5 catches the difference.",
        deviationsFromCorpus: "Standard pattern recast with insertion semantics."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T15:00:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T15:00:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  },

  // ===== Entry 10: dynamic_programming_2d =====
  {
    id: "gold-010",
    categoryId: "dsa",
    input: {
      categoryId: "dsa",
      classContextId: "ctx-heaps-and-stacks", // for seed; DP-2D class context would be later
      targetConcepts: {
        primary: ["dynamic_programming_2d"],
        secondary: ["arrays", "recursion"],
        mustNotRequire: ["graphs", "heaps"]
      },
      difficultyTarget: { tier: "hard", expectedSolveTimeMinutes: 60, expectedConceptCount: 2, constraintComplexity: "many" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "warehouse", avoidOverused: ["unique_paths"] },
      corpusSliceIds: ["q-longest-palindrome"]
    },
    output: {
      id: "gold-010-output",
      request: undefined as any,
      problem: {
        title: "Maximum-Value Pick Path Through a Warehouse Grid",
        statement: `A warehouse robot starts at the top-left cell of an \`r × c\` grid and must reach the bottom-right cell. From any cell, the robot may move only **right** or **down**. Each cell contains an item value \`grid[i][j]\` (can be negative — some cells have storage costs). The robot picks up the value of every cell it visits, including the start and end.

Return the **maximum total value** the robot can accumulate on any valid path from \`(0,0)\` to \`(r-1, c-1)\`.`,
        inputFormat: "First line: integers r and c (1 ≤ r, c ≤ 1000). Next r lines: each with c space-separated integers in [-10^6, 10^6].",
        outputFormat: "A single integer: maximum path sum.",
        constraints: ["1 ≤ r, c ≤ 1000", "-10^6 ≤ grid[i][j] ≤ 10^6", "Time: 2 seconds"],
        examples: [
          { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "12", explanation: "Path 1→3→5→2→1 = 12 (right, down, down, right)." },
          { input: "2 2\n-1 -2\n-3 -4", output: "-7", explanation: "All negatives; best path -1 → -3 → -4 = -8 vs -1 → -2 → -4 = -7. Take the less-bad path." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def max_path_value(grid: list[list[int]]) -> int:
    pass

if __name__ == "__main__":
    r, c = map(int, input().split())
    grid = [list(map(int, input().split())) for _ in range(r)]
    print(max_path_value(grid))`
      }],
      referenceSolution: {
        language: "python",
        code: `def max_path_value(grid):
    r, c = len(grid), len(grid[0])
    # Space-optimized: roll a single row.
    dp = [0] * c
    dp[0] = grid[0][0]
    for j in range(1, c):
        dp[j] = dp[j-1] + grid[0][j]
    for i in range(1, r):
        dp[0] = dp[0] + grid[i][0]
        for j in range(1, c):
            dp[j] = max(dp[j], dp[j-1]) + grid[i][j]
    return dp[-1]

if __name__ == "__main__":
    r, c = map(int, input().split())
    grid = [list(map(int, input().split())) for _ in range(r)]
    print(max_path_value(grid))`,
        complexityTime: "O(r·c)",
        complexitySpace: "O(c)"
      },
      bruteForceSolution: {
        language: "python",
        code: `def max_path_value(grid):
    r, c = len(grid), len(grid[0])
    def rec(i, j):
        if i == r-1 and j == c-1: return grid[i][j]
        if i >= r or j >= c: return float('-inf')
        return grid[i][j] + max(rec(i+1, j), rec(i, j+1))
    return rec(0, 0)`
      },
      testCases: [
        { id: "tc1", input: "3 3\n1 3 1\n1 5 1\n4 2 1", expectedOutput: "12", visibility: "sample", rationale: "Positive values, standard path." },
        { id: "tc2", input: "2 2\n-1 -2\n-3 -4", expectedOutput: "-7", visibility: "sample", rationale: "All negative; correct answer requires max not min." },
        { id: "tc3", input: "1 1\n42", expectedOutput: "42", visibility: "hidden", rationale: "Single cell." },
        { id: "tc4", input: "1 5\n1 2 3 4 5", expectedOutput: "15", visibility: "hidden", rationale: "Single row — only path." },
        { id: "tc5", input: "5 1\n1\n2\n3\n4\n5", expectedOutput: "15", visibility: "hidden", rationale: "Single column." },
        { id: "tc6", input: "1000 1000\n" + Array.from({length:1000}, (_,i) => Array.from({length:1000}, (_,j) => String((i+j) % 100 - 50)).join(" ")).join("\n"), expectedOutput: "0", visibility: "hidden", rationale: "Worst case r*c = 10^6; brute force exponential. Tests O(r*c) requirement." }
      ],
      rubric: {
        evaluationDimensions: [
          {
            dimension: "Correct 2D DP recurrence",
            weight: 0.5,
            anchors: {
              5: "dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1]); first row/column handled.",
              3: "Recurrence correct but boundary (first row/col) wrong.",
              1: "Wrong recurrence (e.g., uses min, sums all reachable cells)."
            },
            evidenceRequired: "max() of upper and left predecessors in inner loop"
          },
          {
            dimension: "Negative-value handling",
            weight: 0.2,
            anchors: {
              5: "Uses max() consistently; tc2 (all negatives) correct.",
              3: "Treats negatives correctly in some paths but fails on all-negative.",
              1: "Defaults to 0 / min / wrong semantics."
            },
            evidenceRequired: "Passes tc2"
          },
          {
            dimension: "Boundary cases",
            weight: 0.2,
            anchors: {
              5: "1×1, 1×n, n×1 all handled.",
              3: "One boundary fails.",
              1: "Multiple boundaries fail."
            },
            evidenceRequired: "Passes tc3, tc4, tc5"
          },
          {
            dimension: "Complexity / space optimization",
            weight: 0.1,
            anchors: {
              5: "O(r·c) time; learner explains O(c) or O(r) space rolling array.",
              3: "O(r·c) time and space (full grid).",
              1: "Exponential recursion / TLE on tc6."
            },
            evidenceRequired: "Passes tc6 within time limit"
          }
        ],
        conceptsBeingAssessed: ["dynamic_programming_2d"],
        redFlags: ["uses BFS/Dijkstra (not appropriate without weights)", "uses brute-force recursion without memoization", "default values of 0 break on all-negative grids"]
      },
      metadata: {
        conceptsRequired: ["dynamic_programming_2d", "arrays"],
        conceptsOptional: ["recursion"],
        estimatedDifficultyScore: 0.75,
        estimatedSolveTimeMinutes: 60,
        realWorldDomain: "warehouse",
        noveltyHash: "h-grid-path-010",
        sourceInspirations: [{ corpusId: "q-longest-palindrome", similarity: 0.2 }]
      },
      reasoningTrace: {
        conceptSelectionRationale: "Grid-path-max-sum is the canonical 2D DP problem; framing as warehouse robot navigation makes movement constraints natural.",
        scenarioSelectionRationale: "Warehouse robotics with value/cost cells is a real engineering scenario (think order-pick optimization).",
        difficultyCalibrationRationale: "Hard: 2D state requires recognizing the dependency structure; negative-value handling and space optimization separate strong from weak solutions.",
        deviationsFromCorpus: "Longest-palindromic-substring is string-based 2D DP with different state semantics; path-sum is grid-based with different recurrence."
      },
      versions: GOLD_VERSIONS,
      createdAt: "2026-01-17T15:30:00Z"
    },
    authoredBy: "user-instructor-1",
    authoredAt: "2026-01-17T15:30:00Z",
    status: "canonical",
    taxonomyVersion: 1,
    humanRatings: RATINGS_HIGH
  }
];
```

---

(Continues in part 3 — example assignments, prompt proposals, concept proposals, index file)

<!-- Part 3 boundary -->

## 6. Example assignments (`assignments.ts`)

Six pre-generated assignments demonstrating the UI states the prototype must show: approved on first try, approved after refinement, awaiting review, rejected by reviewer, failed at max iterations, and failed on a hard check. Each carries the full pipeline trace (verification runs, eval runs, refinement iterations, instructor reviews) needed to populate Document A's assignment detail page.

For prototype seed purposes these assignments use compact-but-complete content. Quality is plausible-not-exemplar (that's the gold set's job) — these are scaffolding for UI demonstration.

```ts
import type {
  GeneratedAssignment,
  AssignmentRequest,
  VerificationRun,
  EvalRun,
  RefinementIteration,
  InstructorReview
} from "../../types";

/**
 * The frontend seed bundles each assignment with its full trace.
 * In Document B (real backend), these become separate table rows linked by assignment_id.
 */
export interface SeededAssignment {
  id: string;
  categoryId: "dsa";
  request: AssignmentRequest;
  status: "approved" | "pending_review" | "rejected" | "failed" | "abandoned";
  pipelineVersion: string;
  promptVersionIds: {
    generation: string;
    eval_judge: Record<string, string>;
    difficulty_assessor: string;
    concept_extraction: string;
  };
  judgeVersionId: string;
  taxonomyVersion: number;
  goldSetVersion: number;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;

  // Pipeline trace
  finalOutput: GeneratedAssignment | null;            // null if failed before any output
  refinementIterations: RefinementIteration[];
  verificationRuns: VerificationRun[];
  evalRuns: EvalRun[];
  instructorReview: InstructorReview | null;
}

const STANDARD_VERSIONS = {
  pipelineVersion: "pipeline:dsa:0.3.2",
  promptVersionIds: {
    generation: "prompt-generation-v3",
    eval_judge: {
      problem_clarity: "prompt-judge-clarity-v1",
      test_case_coverage: "prompt-judge-test-coverage-v1",
      complexity_correctness: "prompt-judge-complexity-v1",
      concept_rubric_alignment: "prompt-judge-alignment-v1",
      real_world_fidelity: "prompt-judge-realworld-v1",
      novelty: "prompt-judge-novelty-v1"
    },
    difficulty_assessor: "prompt-difficulty-v1",
    concept_extraction: "prompt-extraction-v1"
  },
  judgeVersionId: "judge:dsa:v1-2026-01-08",
  taxonomyVersion: 1,
  goldSetVersion: 1
};

// Default thresholds in use when these assignments ran (gold set ≥ 10 entries, so derived from p25)
const ACTIVE_THRESHOLDS = [
  { dimension: "problem_clarity", threshold: 3.5, source: "gold_set" as const },
  { dimension: "test_case_coverage", threshold: 3.5, source: "gold_set" as const },
  { dimension: "complexity_correctness", threshold: 4.0, source: "gold_set" as const },
  { dimension: "concept_rubric_alignment", threshold: 3.5, source: "gold_set" as const },
  { dimension: "real_world_fidelity", threshold: 3.0, source: "gold_set" as const },
  { dimension: "novelty", threshold: 3.0, source: "gold_set" as const }
];

export const DSA_EXAMPLE_ASSIGNMENTS: SeededAssignment[] = [

  // ===== Example 1: APPROVED (single iteration, high scores) =====
  {
    id: "asn-001",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: {
        primary: ["hashmaps", "hashmap_lookup"],
        secondary: ["frequency_counting"],
        mustNotRequire: ["dynamic_programming_1d", "graphs"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "api_security", avoidOverused: ["two_sum"] },
      corpusSliceIds: ["q-two-sum", "q-group-anagrams"]
    },
    status: "approved",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-03T09:15:00Z",
    completedAt: "2026-02-03T09:21:43Z",
    finalOutput: {
      id: "asn-001-output",
      request: undefined as any,
      problem: {
        title: "Detect First Duplicate API Key Usage",
        statement: `An API gateway logs every authentication attempt with the API key used. To detect credential sharing, the security team needs to find the **first API key that is used more than once** in a deploy window. Return the API key whose second occurrence has the smallest position in the log.

If no key is reused, return the string \`"none"\`.`,
        inputFormat: "First line: integer n (1 ≤ n ≤ 10^5). Next n lines: each line is an API key (alphanumeric string, length 1–32).",
        outputFormat: "A single line: the first reused key, or \"none\".",
        constraints: ["1 ≤ n ≤ 100,000", "Each key matches /^[a-zA-Z0-9]{1,32}$/"],
        examples: [
          { input: "5\nakA1\nbkB2\nakA1\nckC3\nbkB2", output: "akA1", explanation: "akA1 reuses at position 2 (second occurrence) before bkB2 reuses at position 4." },
          { input: "3\nx\ny\nz", output: "none", explanation: "No reuse." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def first_duplicate_key(keys: list[str]) -> str:\n    pass\n\nif __name__ == "__main__":\n    n = int(input())\n    keys = [input().strip() for _ in range(n)]\n    print(first_duplicate_key(keys))`
      }],
      referenceSolution: {
        language: "python",
        code: `def first_duplicate_key(keys):\n    seen = set()\n    for k in keys:\n        if k in seen:\n            return k\n        seen.add(k)\n    return "none"\n\nif __name__ == "__main__":\n    n = int(input())\n    keys = [input().strip() for _ in range(n)]\n    print(first_duplicate_key(keys))`,
        complexityTime: "O(n)",
        complexitySpace: "O(n)"
      },
      bruteForceSolution: null,
      testCases: [
        { id: "tc1", input: "5\nakA1\nbkB2\nakA1\nckC3\nbkB2", expectedOutput: "akA1", visibility: "sample", rationale: "Standard duplicate detection." },
        { id: "tc2", input: "3\nx\ny\nz", expectedOutput: "none", visibility: "sample", rationale: "No duplicate." },
        { id: "tc3", input: "1\nlonelyKey", expectedOutput: "none", visibility: "hidden", rationale: "Single element." },
        { id: "tc4", input: "2\nsame\nsame", expectedOutput: "same", visibility: "hidden", rationale: "Minimum duplicate." },
        { id: "tc5", input: "6\nA\nB\nC\nB\nA\nC", expectedOutput: "B", visibility: "hidden", rationale: "Multiple duplicates; first second-occurrence wins." },
        { id: "tc6", input: "100000\n" + Array.from({length: 99999}, (_,i) => `key${i}`).join("\n") + "\nkey0", expectedOutput: "key0", visibility: "hidden", rationale: "Worst-case n=10^5 with reuse only at the very end." }
      ],
      rubric: {
        evaluationDimensions: [
          { dimension: "Hashmap-based duplicate detection", weight: 0.5, anchors: { 5: "Set/dict for O(1) lookup; single pass; returns on first hit.", 3: "Hashmap used but per-element scan inside loop.", 1: "No hashmap; nested loops." }, evidenceRequired: "Set/dict usage in linear pass" },
          { dimension: "Correct 'first reuse' semantics", weight: 0.3, anchors: { 5: "Returns key whose second occurrence is earliest.", 3: "Returns some duplicate but not the earliest one.", 1: "Wrong semantics." }, evidenceRequired: "Returns on first 'already seen' hit" },
          { dimension: "Edge cases", weight: 0.2, anchors: { 5: "Single element returns 'none'; minimum duplicate works.", 3: "One edge fails.", 1: "Multiple edges fail." }, evidenceRequired: "Passes tc3, tc4" }
        ],
        conceptsBeingAssessed: ["hashmaps", "hashmap_lookup"],
        redFlags: ["uses nested loops", "uses sort"]
      },
      metadata: {
        conceptsRequired: ["hashmaps", "hashmap_lookup", "frequency_counting"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.38,
        estimatedSolveTimeMinutes: 28,
        realWorldDomain: "api_security",
        noveltyHash: "h-asn-001",
        sourceInspirations: [{ corpusId: "q-two-sum", similarity: 0.36 }]
      },
      reasoningTrace: {
        conceptSelectionRationale: "Hashmap-lookup target with frequency-counting secondary; the 'first reuse' framing requires single-pass set tracking.",
        scenarioSelectionRationale: "API key reuse detection is a recognizable security/auth scenario.",
        difficultyCalibrationRationale: "Medium-easy: single-concept primary with small semantic twist; ~25-30 min for a learner.",
        deviationsFromCorpus: "Inspired by Two Sum's hash-lookup pattern; semantically different (reuse detection vs. pair-sum)."
      },
      versions: STANDARD_VERSIONS as any,
      createdAt: "2026-02-03T09:15:00Z"
    },
    refinementIterations: [],
    verificationRuns: [{
      id: "vr-001-1",
      assignmentId: "asn-001",
      iteration: 1,
      hardChecks: {
        schemaValid: true,
        conceptCoverage: { passed: true, missing: [] },
        conceptContainment: { passed: true, outOfScope: [] },
        conceptExclusion: { passed: true, violated: [] },
        difficultyInBand: { passed: true, details: "estimatedSolveTime 28min within ±30% of requested 30min; conceptCount 3 within ±1 of requested 2" },
        leakage: { passed: true, maxSimilarity: 0.36, closestCorpusId: "q-two-sum" },
        codeExecution: {
          passed: true,
          results: [
            { testCaseId: "tc1", passed: true, runtimeMs: 12, output: "akA1" },
            { testCaseId: "tc2", passed: true, runtimeMs: 9, output: "none" },
            { testCaseId: "tc3", passed: true, runtimeMs: 8, output: "none" },
            { testCaseId: "tc4", passed: true, runtimeMs: 8, output: "same" },
            { testCaseId: "tc5", passed: true, runtimeMs: 10, output: "B" },
            { testCaseId: "tc6", passed: true, runtimeMs: 142, output: "key0" }
          ]
        }
      },
      passed: true,
      ranAt: "2026-02-03T09:18:21Z"
    }],
    evalRuns: [{
      id: "er-001-1",
      assignmentId: "asn-001",
      iteration: 1,
      perDimensionScores: [
        { dimension: "problem_clarity", medianScore: 5, individualRuns: [{ score: 5, reasoning: "Statement explicit, formats specified, constraints precise." }, { score: 5, reasoning: "Clear semantics for 'first reused'." }, { score: 4, reasoning: "Mostly clear; minor: 'deploy window' is jargon but contextually obvious." }] },
        { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4, reasoning: "Hidden cases cover single-element and worst-case; all-unique case absent but tc2 partially covers." }, { score: 5, reasoning: "Strong coverage including minimal duplicate." }, { score: 4, reasoning: "Good but no all-unique large test." }] },
        { dimension: "complexity_correctness", medianScore: 5, individualRuns: [{ score: 5, reasoning: "O(n) correctly claimed and achieved; no brute force needed for this simple case." }, { score: 5, reasoning: "Tight." }, { score: 5, reasoning: "Correct." }] },
        { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4, reasoning: "Both primaries appear in rubric. Could break out hashmap-vs-set choice into its own dimension." }, { score: 4, reasoning: "Aligned." }, { score: 5, reasoning: "Rubric grades exactly the concepts the problem requires." }] },
        { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4, reasoning: "API key reuse detection is plausible; could include rate-limit context for stronger realism." }, { score: 4, reasoning: "Good framing." }, { score: 4, reasoning: "Recognizable scenario." }] },
        { dimension: "novelty", medianScore: 4, individualRuns: [{ score: 4, reasoning: "Different from Two Sum framing; first-reuse semantic is distinctive." }, { score: 3, reasoning: "Recognizable hash-set duplicate-detection pattern; framing helps." }, { score: 4, reasoning: "Adequate novelty for medium tier." }] }
      ],
      compositeScore: 4.3,
      passedThresholds: true,
      thresholdsUsed: ACTIVE_THRESHOLDS,
      ranAt: "2026-02-03T09:20:55Z"
    }],
    instructorReview: {
      id: "rev-001",
      assignmentId: "asn-001",
      reviewer: "user-instructor-1",
      status: "approved",
      ratings: [
        { dimension: "problem_clarity", score: 5 },
        { dimension: "concept_rubric_alignment", score: 5 },
        { dimension: "real_world_fidelity", score: 4 }
      ],
      comments: "Solid first-pass output. Approved as-is.",
      reviewedAt: "2026-02-03T09:21:43Z"
    }
  },

  // ===== Example 2: APPROVED after one refinement =====
  {
    id: "asn-002",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: {
        primary: ["sliding_window"],
        secondary: ["hashmaps"],
        mustNotRequire: ["dynamic_programming_1d", "heaps"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "authentication", avoidOverused: ["longest_substring_without_repeat"] },
      corpusSliceIds: ["q-longest-unique-substring"]
    },
    status: "approved",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-04T14:00:00Z",
    completedAt: "2026-02-04T14:09:12Z",
    finalOutput: {
      id: "asn-002-output-iter2",
      request: undefined as any,
      problem: {
        title: "Peak Hour Login Rate",
        statement: `An authentication service records the number of successful logins each minute. The on-call team wants to compute the **maximum total logins observed during any contiguous window of W minutes** so they can size the rate-limiter for peak hours.

Given an array \`logins\` of integers (one per minute) and the window size \`W\`, return the maximum sum of logins over any window of length exactly W.`,
        inputFormat: "First line: integers n and W (1 ≤ W ≤ n ≤ 10^5). Second line: n space-separated integers in [0, 10^6].",
        outputFormat: "A single integer: maximum window sum.",
        constraints: ["1 ≤ W ≤ n ≤ 100,000", "0 ≤ logins[i] ≤ 1,000,000"],
        examples: [
          { input: "6 3\n5 10 20 4 8 15", output: "35", explanation: "Window [10,20,4]=34 vs [4,8,15]=27 vs [20,4,8]=32 vs [5,10,20]=35. Best: 35." },
          { input: "4 4\n1 2 3 4", output: "10", explanation: "Only window covers all four." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def peak_window_sum(logins: list[int], w: int) -> int:\n    pass\n\nif __name__ == "__main__":\n    n, w = map(int, input().split())\n    arr = list(map(int, input().split()))\n    print(peak_window_sum(arr, w))`
      }],
      referenceSolution: {
        language: "python",
        code: `def peak_window_sum(logins, w):\n    cur = sum(logins[:w])\n    best = cur\n    for i in range(w, len(logins)):\n        cur += logins[i] - logins[i - w]\n        if cur > best:\n            best = cur\n    return best\n\nif __name__ == "__main__":\n    n, w = map(int, input().split())\n    arr = list(map(int, input().split()))\n    print(peak_window_sum(arr, w))`,
        complexityTime: "O(n)",
        complexitySpace: "O(1)"
      },
      bruteForceSolution: null,
      testCases: [
        { id: "tc1", input: "6 3\n5 10 20 4 8 15", expectedOutput: "35", visibility: "sample", rationale: "Standard." },
        { id: "tc2", input: "4 4\n1 2 3 4", expectedOutput: "10", visibility: "sample", rationale: "Window equals array length." },
        { id: "tc3", input: "1 1\n42", expectedOutput: "42", visibility: "hidden", rationale: "Minimum size." },
        { id: "tc4", input: "5 1\n3 7 2 9 1", expectedOutput: "9", visibility: "hidden", rationale: "W=1 — equivalent to max element." },
        { id: "tc5", input: "5 5\n0 0 0 0 0", expectedOutput: "0", visibility: "hidden", rationale: "All zeros." },
        { id: "tc6", input: "100000 100\n" + Array.from({length:100000},(_,i)=>String(i%500)).join(" "), expectedOutput: "49950", visibility: "hidden", rationale: "Scale test for O(n) requirement." }
      ],
      rubric: {
        evaluationDimensions: [
          { dimension: "Sliding window with O(1) update", weight: 0.6, anchors: { 5: "Maintains running sum, adds new and subtracts old per step.", 3: "Recomputes window each time (O(n·W)).", 1: "No sliding pattern." }, evidenceRequired: "Constant-work update inside loop" },
          { dimension: "Correct window boundaries", weight: 0.2, anchors: { 5: "Window of exactly W consecutive elements; W=1 and W=n correct.", 3: "Off-by-one in initial or final iteration.", 1: "Skips windows or wraps incorrectly." }, evidenceRequired: "Passes tc3, tc4, tc2" },
          { dimension: "Complexity", weight: 0.2, anchors: { 5: "O(n) time, O(1) space; passes tc6.", 3: "O(n·W) — fails tc6.", 1: "Worse." }, evidenceRequired: "Passes tc6" }
        ],
        conceptsBeingAssessed: ["sliding_window"],
        redFlags: ["recomputes window sum each iteration"]
      },
      metadata: {
        conceptsRequired: ["sliding_window", "arrays"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.4,
        estimatedSolveTimeMinutes: 27,
        realWorldDomain: "authentication",
        noveltyHash: "h-asn-002-v2",
        sourceInspirations: [{ corpusId: "q-longest-unique-substring", similarity: 0.31 }]
      },
      reasoningTrace: {
        conceptSelectionRationale: "Fixed-size sliding window with running-sum maintenance.",
        scenarioSelectionRationale: "Auth login rate is a recognizable infra concern (rate-limiter sizing).",
        difficultyCalibrationRationale: "Medium: technique is simple but O(1) update is the discriminator.",
        deviationsFromCorpus: "Longest-substring is variable-size with hashmap; this is fixed-size pure-sum."
      },
      versions: STANDARD_VERSIONS as any,
      createdAt: "2026-02-04T14:07:30Z"
    },
    refinementIterations: [{
      iteration: 2,
      triggeredBy: "soft_score_fail",
      failureSignal: "problem_clarity scored 3 (threshold 3.5). Judge reasoning: 'Statement is ambiguous about whether window is per-minute count or per-second; W units not specified.'",
      outputId: "asn-002-output-iter2",
      scoreImprovement: 1.4
    }],
    verificationRuns: [
      {
        id: "vr-002-1",
        assignmentId: "asn-002",
        iteration: 1,
        hardChecks: {
          schemaValid: true,
          conceptCoverage: { passed: true, missing: [] },
          conceptContainment: { passed: true, outOfScope: [] },
          conceptExclusion: { passed: true, violated: [] },
          difficultyInBand: { passed: true, details: "within band" },
          leakage: { passed: true, maxSimilarity: 0.31, closestCorpusId: "q-longest-unique-substring" },
          codeExecution: { passed: true, results: [{ testCaseId: "tc1", passed: true, runtimeMs: 8 }, { testCaseId: "tc2", passed: true, runtimeMs: 7 }] }
        },
        passed: true,
        ranAt: "2026-02-04T14:03:12Z"
      },
      {
        id: "vr-002-2",
        assignmentId: "asn-002",
        iteration: 2,
        hardChecks: {
          schemaValid: true,
          conceptCoverage: { passed: true, missing: [] },
          conceptContainment: { passed: true, outOfScope: [] },
          conceptExclusion: { passed: true, violated: [] },
          difficultyInBand: { passed: true, details: "within band" },
          leakage: { passed: true, maxSimilarity: 0.31, closestCorpusId: "q-longest-unique-substring" },
          codeExecution: {
            passed: true,
            results: [
              { testCaseId: "tc1", passed: true, runtimeMs: 9, output: "35" },
              { testCaseId: "tc2", passed: true, runtimeMs: 7, output: "10" },
              { testCaseId: "tc3", passed: true, runtimeMs: 6, output: "42" },
              { testCaseId: "tc4", passed: true, runtimeMs: 7, output: "9" },
              { testCaseId: "tc5", passed: true, runtimeMs: 7, output: "0" },
              { testCaseId: "tc6", passed: true, runtimeMs: 168, output: "49950" }
            ]
          }
        },
        passed: true,
        ranAt: "2026-02-04T14:07:31Z"
      }
    ],
    evalRuns: [
      {
        id: "er-002-1",
        assignmentId: "asn-002",
        iteration: 1,
        perDimensionScores: [
          { dimension: "problem_clarity", medianScore: 3, individualRuns: [{ score: 3, reasoning: "Ambiguous units — 'per minute' implied but not stated." }, { score: 3, reasoning: "Window unit unclear." }, { score: 4, reasoning: "Mostly clear." }] },
          { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "complexity_correctness", medianScore: 5, individualRuns: [{ score: 5 }, { score: 5 }, { score: 5 }] as any },
          { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any }
        ],
        compositeScore: 3.7,
        passedThresholds: false,
        thresholdsUsed: ACTIVE_THRESHOLDS,
        ranAt: "2026-02-04T14:05:22Z"
      },
      {
        id: "er-002-2",
        assignmentId: "asn-002",
        iteration: 2,
        perDimensionScores: [
          { dimension: "problem_clarity", medianScore: 5, individualRuns: [{ score: 5, reasoning: "Units explicit; statement now self-contained." }, { score: 5 }, { score: 4 }] as any },
          { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "complexity_correctness", medianScore: 5, individualRuns: [{ score: 5 }, { score: 5 }, { score: 5 }] as any },
          { dimension: "concept_rubric_alignment", medianScore: 5, individualRuns: [{ score: 5 }, { score: 5 }, { score: 4 }] as any },
          { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "novelty", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 3 }] as any }
        ],
        compositeScore: 4.5,
        passedThresholds: true,
        thresholdsUsed: ACTIVE_THRESHOLDS,
        ranAt: "2026-02-04T14:08:50Z"
      }
    ],
    instructorReview: {
      id: "rev-002",
      assignmentId: "asn-002",
      reviewer: "user-instructor-1",
      status: "approved",
      ratings: [{ dimension: "problem_clarity", score: 5 }, { dimension: "real_world_fidelity", score: 4 }],
      comments: "Refinement fixed the unit ambiguity. Approved.",
      reviewedAt: "2026-02-04T14:09:12Z"
    }
  },

  // ===== Example 3: AWAITING REVIEW =====
  {
    id: "asn-003",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-sliding-window-and-prefix",
      targetConcepts: {
        primary: ["two_pointers"],
        secondary: ["sorting"],
        mustNotRequire: ["heaps", "dynamic_programming_1d"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "scheduling", avoidOverused: ["three_sum"] },
      corpusSliceIds: ["q-three-sum"]
    },
    status: "pending_review",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-05T11:30:00Z",
    completedAt: "2026-02-05T11:36:18Z",
    finalOutput: {
      id: "asn-003-output",
      request: undefined as any,
      problem: {
        title: "Find Two Tasks Whose Durations Sum to a Time Slot",
        statement: `A scheduling system has an open time slot of duration \`T\` minutes. From a backlog of tasks with given durations, the scheduler wants to find **any two distinct tasks** whose durations sum to **exactly** \`T\` so they fit perfectly. Return the pair (as the two durations, smaller first), or output \`"none"\` if no such pair exists.

If multiple pairs exist, return the pair containing the smallest duration; break further ties by smaller second duration.`,
        inputFormat: "First line: integers n and T (2 ≤ n ≤ 10^5; 1 ≤ T ≤ 2×10^9). Second line: n space-separated integers in [1, 10^9].",
        outputFormat: "Either two space-separated integers (smaller first), or \"none\".",
        constraints: ["2 ≤ n ≤ 100,000", "Tasks must be at different indices"],
        examples: [
          { input: "5 30\n10 20 15 5 25", output: "5 25", explanation: "5+25=30; pairs (10,20) and (5,25) sum to 30. Smaller-first pair is (5,25)." },
          { input: "3 100\n10 20 30", output: "none", explanation: "No pair sums to 100." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def find_pair_for_slot(durations: list[int], target: int) -> str:\n    pass\n\nif __name__ == "__main__":\n    n, t = map(int, input().split())\n    d = list(map(int, input().split()))\n    print(find_pair_for_slot(d, t))`
      }],
      referenceSolution: {
        language: "python",
        code: `def find_pair_for_slot(durations, target):\n    arr = sorted(durations)\n    left, right = 0, len(arr) - 1\n    best = None\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target:\n            if best is None or arr[left] < best[0]:\n                best = (arr[left], arr[right])\n            left += 1\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return f"{best[0]} {best[1]}" if best else "none"\n\nif __name__ == "__main__":\n    n, t = map(int, input().split())\n    d = list(map(int, input().split()))\n    print(find_pair_for_slot(d, t))`,
        complexityTime: "O(n log n)",
        complexitySpace: "O(n) for sort"
      },
      bruteForceSolution: {
        language: "python",
        code: `def find_pair_for_slot(durations, target):\n    best = None\n    for i in range(len(durations)):\n        for j in range(i+1, len(durations)):\n            if durations[i] + durations[j] == target:\n                a, b = sorted([durations[i], durations[j]])\n                if best is None or a < best[0]:\n                    best = (a, b)\n    return f"{best[0]} {best[1]}" if best else "none"`
      },
      testCases: [
        { id: "tc1", input: "5 30\n10 20 15 5 25", expectedOutput: "5 25", visibility: "sample", rationale: "Multiple pairs; smaller-first tie-break." },
        { id: "tc2", input: "3 100\n10 20 30", expectedOutput: "none", visibility: "sample", rationale: "No pair." },
        { id: "tc3", input: "2 50\n20 30", expectedOutput: "20 30", visibility: "hidden", rationale: "Minimum n=2 with valid pair." },
        { id: "tc4", input: "2 50\n10 30", expectedOutput: "none", visibility: "hidden", rationale: "Minimum n=2 with no valid pair." },
        { id: "tc5", input: "4 40\n20 20 20 20", expectedOutput: "20 20", visibility: "hidden", rationale: "Duplicates — two distinct indices with same value." },
        { id: "tc6", input: "100000 1500000000\n" + Array.from({length: 100000}, (_, i) => String(i + 1)).join(" "), expectedOutput: "none", visibility: "hidden", rationale: "Worst-case n=10^5, target unreachable." }
      ],
      rubric: {
        evaluationDimensions: [
          { dimension: "Two-pointer pattern on sorted array", weight: 0.5, anchors: { 5: "Sorts then sweeps with left/right pointers.", 3: "Uses hashmap (works but not the target pattern).", 1: "Brute force nested loops." }, evidenceRequired: "Sort + two-pointer sweep" },
          { dimension: "Tie-breaking (smallest first element)", weight: 0.2, anchors: { 5: "After sort, first match in left-to-right sweep gives smallest-first.", 3: "Returns a valid pair but wrong tie-break.", 1: "Returns wrong pair." }, evidenceRequired: "Passes tc1 (multi-pair case)" },
          { dimension: "Distinctness handling", weight: 0.2, anchors: { 5: "Uses left < right; tc5 (duplicates) works correctly.", 3: "Off-by-one but passes most cases.", 1: "Allows same index twice." }, evidenceRequired: "Passes tc5" },
          { dimension: "Complexity", weight: 0.1, anchors: { 5: "O(n log n); passes tc6.", 3: "O(n²) brute force.", 1: "Worse." }, evidenceRequired: "Passes tc6" }
        ],
        conceptsBeingAssessed: ["two_pointers", "sorting"],
        redFlags: ["uses three nested loops", "doesn't sort"]
      },
      metadata: {
        conceptsRequired: ["two_pointers", "sorting", "arrays"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.42,
        estimatedSolveTimeMinutes: 33,
        realWorldDomain: "scheduling",
        noveltyHash: "h-asn-003",
        sourceInspirations: [{ corpusId: "q-three-sum", similarity: 0.38 }]
      },
      reasoningTrace: {
        conceptSelectionRationale: "Two-pointer on sorted array; exact-sum variant.",
        scenarioSelectionRationale: "Task scheduling into a fixed slot is a recognizable productivity/calendar problem.",
        difficultyCalibrationRationale: "Medium: standard pattern + tie-breaking constraint.",
        deviationsFromCorpus: "Inspired by 3Sum but reduced to pairs with exact target rather than zero-sum."
      },
      versions: STANDARD_VERSIONS as any,
      createdAt: "2026-02-05T11:35:00Z"
    },
    refinementIterations: [],
    verificationRuns: [{
      id: "vr-003-1",
      assignmentId: "asn-003",
      iteration: 1,
      hardChecks: {
        schemaValid: true,
        conceptCoverage: { passed: true, missing: [] },
        conceptContainment: { passed: true, outOfScope: [] },
        conceptExclusion: { passed: true, violated: [] },
        difficultyInBand: { passed: true, details: "within band" },
        leakage: { passed: true, maxSimilarity: 0.38, closestCorpusId: "q-three-sum" },
        codeExecution: { passed: true, results: [{ testCaseId: "tc1", passed: true, runtimeMs: 11 }, { testCaseId: "tc6", passed: true, runtimeMs: 156 }] }
      },
      passed: true,
      ranAt: "2026-02-05T11:33:45Z"
    }],
    evalRuns: [{
      id: "er-003-1",
      assignmentId: "asn-003",
      iteration: 1,
      perDimensionScores: [
        { dimension: "problem_clarity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 5 }] as any },
        { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
        { dimension: "complexity_correctness", medianScore: 5, individualRuns: [{ score: 5 }, { score: 5 }, { score: 5 }] as any },
        { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
        { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 3 }] as any },
        { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 4 }] as any }
      ],
      compositeScore: 4.0,
      passedThresholds: true,
      thresholdsUsed: ACTIVE_THRESHOLDS,
      ranAt: "2026-02-05T11:36:18Z"
    }],
    instructorReview: null
  },

  // ===== Example 4: REJECTED by instructor =====
  {
    id: "asn-004",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-trees-and-recursion",
      targetConcepts: {
        primary: ["tree_traversal_dfs", "binary_search_tree"],
        secondary: ["recursion"],
        mustNotRequire: ["heaps", "graphs"]
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "subscriptions", avoidOverused: ["validate_bst"] },
      corpusSliceIds: ["q-binary-tree-inorder"]
    },
    status: "rejected",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-06T10:00:00Z",
    completedAt: "2026-02-06T10:14:55Z",
    finalOutput: {
      id: "asn-004-output",
      request: undefined as any,
      problem: {
        title: "Locate Subscription Tier from Pricing Tree",
        statement: `A subscription service organizes pricing tiers in a binary search tree keyed by monthly cost in cents. Given the BST root and a query price \`p\`, return the **closest tier price** (the BST value with the smallest absolute difference from \`p\`). On ties, return the lower price.

The tree is provided as a flat array of (value, left_idx, right_idx) tuples; index 0 is the root.`,
        inputFormat: "First line: integers n and p (1 ≤ n ≤ 10^5; 0 ≤ p ≤ 10^9). Next n lines: 'val left_idx right_idx'.",
        outputFormat: "Single integer: closest BST value.",
        constraints: ["Tree is a valid BST", "n ≥ 1"],
        examples: [
          { input: "5 700\n500 1 2\n300 -1 -1\n900 3 4\n700 -1 -1\n1200 -1 -1", output: "700", explanation: "Exact match exists." },
          { input: "3 250\n300 1 2\n100 -1 -1\n500 -1 -1", output: "300", explanation: "|300-250|=50 < |100-250|=150 < |500-250|=250." }
        ]
      },
      starterCode: [{
        language: "python",
        code: `def closest_tier(rows, p):\n    pass\n\nif __name__ == "__main__":\n    n, p = map(int, input().split())\n    rows = [tuple(map(int, input().split())) for _ in range(n)]\n    print(closest_tier(rows, p))`
      }],
      referenceSolution: {
        language: "python",
        code: `def closest_tier(rows, p):\n    # Build adj\n    n = len(rows)\n    val = [r[0] for r in rows]\n    L = [r[1] for r in rows]\n    R = [r[2] for r in rows]\n    best = val[0]\n    i = 0\n    while i != -1:\n        v = val[i]\n        if abs(v - p) < abs(best - p) or (abs(v - p) == abs(best - p) and v < best):\n            best = v\n        if v == p:\n            break\n        i = L[i] if p < v else R[i]\n    return best\n\nif __name__ == "__main__":\n    n, p = map(int, input().split())\n    rows = [tuple(map(int, input().split())) for _ in range(n)]\n    print(closest_tier(rows, p))`,
        complexityTime: "O(h) where h is tree height",
        complexitySpace: "O(1)"
      },
      bruteForceSolution: null,
      testCases: [
        { id: "tc1", input: "5 700\n500 1 2\n300 -1 -1\n900 3 4\n700 -1 -1\n1200 -1 -1", expectedOutput: "700", visibility: "sample", rationale: "Exact match." },
        { id: "tc2", input: "3 250\n300 1 2\n100 -1 -1\n500 -1 -1", expectedOutput: "300", visibility: "sample", rationale: "Closest above query." },
        { id: "tc3", input: "1 999\n500 -1 -1", expectedOutput: "500", visibility: "hidden", rationale: "Single-node tree." },
        { id: "tc4", input: "3 200\n300 1 2\n100 -1 -1\n500 -1 -1", expectedOutput: "100", visibility: "hidden", rationale: "Tie between 100 and 300; lower wins." },
        { id: "tc5", input: "5 0\n100 1 2\n50 3 -1\n200 -1 4\n25 -1 -1\n300 -1 -1", expectedOutput: "25", visibility: "hidden", rationale: "Query smaller than minimum value." },
        { id: "tc6", input: "100000 500000000\n" + Array.from({length: 100000}, (_, i) => `${i * 10000} ${i+1 === 100000 ? -1 : i+1} -1`).join("\n"), expectedOutput: "500000000", visibility: "hidden", rationale: "Skewed tree at scale; tests O(h) traversal." }
      ],
      rubric: {
        evaluationDimensions: [
          { dimension: "BST descent for closest-value", weight: 0.5, anchors: { 5: "Descends using BST property; tracks closest along path.", 3: "Visits whole tree (O(n)) but correct.", 1: "Wrong traversal logic." }, evidenceRequired: "Tracks closest while descending one path" },
          { dimension: "Tie-breaking semantics", weight: 0.2, anchors: { 5: "Lower value wins on tie.", 3: "Tie-break wrong direction.", 1: "No tie-break logic." }, evidenceRequired: "Passes tc4" },
          { dimension: "Boundary cases", weight: 0.2, anchors: { 5: "Single-node, out-of-range queries handled.", 3: "One edge fails.", 1: "Multiple edges fail." }, evidenceRequired: "Passes tc3, tc5" },
          { dimension: "Complexity", weight: 0.1, anchors: { 5: "O(h) on balanced; passes tc6 fast.", 3: "O(n) full traversal.", 1: "Worse." }, evidenceRequired: "Passes tc6" }
        ],
        conceptsBeingAssessed: ["binary_search_tree", "tree_traversal_dfs"],
        redFlags: ["traverses entire tree", "uses BFS"]
      },
      metadata: {
        conceptsRequired: ["tree_traversal_dfs", "binary_search_tree", "recursion"],
        conceptsOptional: [],
        estimatedDifficultyScore: 0.45,
        estimatedSolveTimeMinutes: 30,
        realWorldDomain: "subscriptions",
        noveltyHash: "h-asn-004",
        sourceInspirations: [{ corpusId: "q-binary-tree-inorder", similarity: 0.29 }]
      },
      reasoningTrace: {
        conceptSelectionRationale: "BST descent with running-best — combines tree traversal and BST property.",
        scenarioSelectionRationale: "Subscription pricing tiers tied to BST keys.",
        difficultyCalibrationRationale: "Medium.",
        deviationsFromCorpus: "Inorder gives sequence; this requires single-path descent — different traversal pattern."
      },
      versions: STANDARD_VERSIONS as any,
      createdAt: "2026-02-06T10:09:00Z"
    },
    refinementIterations: [],
    verificationRuns: [{
      id: "vr-004-1",
      assignmentId: "asn-004",
      iteration: 1,
      hardChecks: {
        schemaValid: true,
        conceptCoverage: { passed: true, missing: [] },
        conceptContainment: { passed: true, outOfScope: [] },
        conceptExclusion: { passed: true, violated: [] },
        difficultyInBand: { passed: true, details: "within band" },
        leakage: { passed: true, maxSimilarity: 0.29, closestCorpusId: "q-binary-tree-inorder" },
        codeExecution: { passed: true, results: [{ testCaseId: "tc1", passed: true, runtimeMs: 9 }, { testCaseId: "tc6", passed: true, runtimeMs: 23 }] }
      },
      passed: true,
      ranAt: "2026-02-06T10:11:30Z"
    }],
    evalRuns: [{
      id: "er-004-1",
      assignmentId: "asn-004",
      iteration: 1,
      perDimensionScores: [
        { dimension: "problem_clarity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
        { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
        { dimension: "complexity_correctness", medianScore: 5, individualRuns: [{ score: 5 }, { score: 5 }, { score: 5 }] as any },
        { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
        { dimension: "real_world_fidelity", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any },
        { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any }
      ],
      compositeScore: 3.8,
      passedThresholds: true,
      thresholdsUsed: ACTIVE_THRESHOLDS,
      ranAt: "2026-02-06T10:13:42Z"
    }],
    instructorReview: {
      id: "rev-004",
      assignmentId: "asn-004",
      reviewer: "user-instructor-1",
      status: "rejected",
      ratings: [
        { dimension: "real_world_fidelity", score: 2 },
        { dimension: "novelty", score: 2 }
      ],
      comments: "Eval passed but the framing is weak — subscription tiers in cents stored as BST keys doesn't reflect how anyone actually structures pricing in production (typically a flat table indexed by tier ID). Rejecting; will regenerate with a different domain. This is a useful failure mode to feed back into the generation prompt.",
      reviewedAt: "2026-02-06T10:14:55Z"
    }
  },

  // ===== Example 5: FAILED — max iterations reached =====
  {
    id: "asn-005",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: {
        primary: ["dynamic_programming_1d"],
        secondary: ["arrays"],
        mustNotRequire: ["graphs", "heaps"]
      },
      difficultyTarget: { tier: "hard", expectedSolveTimeMinutes: 60, expectedConceptCount: 2, constraintComplexity: "many" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "finance", avoidOverused: ["house_robber", "coin_change"] },
      corpusSliceIds: ["q-coin-change", "q-word-break"]
    },
    status: "abandoned",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-07T15:00:00Z",
    completedAt: "2026-02-07T15:24:11Z",
    finalOutput: null,
    refinementIterations: [
      {
        iteration: 2,
        triggeredBy: "soft_score_fail",
        failureSignal: "complexity_correctness scored 3 (threshold 4). Reasoning: 'Claimed O(n) but actual implementation is O(n·k); reference solution does not match claim.'",
        outputId: "asn-005-output-iter2",
        scoreImprovement: 0.0
      },
      {
        iteration: 3,
        triggeredBy: "soft_score_fail",
        failureSignal: "complexity_correctness scored 3 (threshold 4) — third iteration. Reasoning: 'Reference solution is correct algorithmically but uses O(n²) recursion-with-memo without tabulation; stated complexity remains optimistic.'",
        outputId: "asn-005-output-iter3",
        scoreImprovement: 0.0
      }
    ],
    verificationRuns: [
      {
        id: "vr-005-1",
        assignmentId: "asn-005",
        iteration: 1,
        hardChecks: {
          schemaValid: true,
          conceptCoverage: { passed: true, missing: [] },
          conceptContainment: { passed: true, outOfScope: [] },
          conceptExclusion: { passed: true, violated: [] },
          difficultyInBand: { passed: true, details: "within band" },
          leakage: { passed: true, maxSimilarity: 0.41, closestCorpusId: "q-coin-change" },
          codeExecution: { passed: true, results: [] }
        },
        passed: true,
        ranAt: "2026-02-07T15:08:15Z"
      },
      {
        id: "vr-005-2",
        assignmentId: "asn-005",
        iteration: 2,
        hardChecks: {
          schemaValid: true,
          conceptCoverage: { passed: true, missing: [] },
          conceptContainment: { passed: true, outOfScope: [] },
          conceptExclusion: { passed: true, violated: [] },
          difficultyInBand: { passed: true, details: "within band" },
          leakage: { passed: true, maxSimilarity: 0.41, closestCorpusId: "q-coin-change" },
          codeExecution: { passed: true, results: [] }
        },
        passed: true,
        ranAt: "2026-02-07T15:16:22Z"
      },
      {
        id: "vr-005-3",
        assignmentId: "asn-005",
        iteration: 3,
        hardChecks: {
          schemaValid: true,
          conceptCoverage: { passed: true, missing: [] },
          conceptContainment: { passed: true, outOfScope: [] },
          conceptExclusion: { passed: true, violated: [] },
          difficultyInBand: { passed: true, details: "within band" },
          leakage: { passed: true, maxSimilarity: 0.41, closestCorpusId: "q-coin-change" },
          codeExecution: { passed: true, results: [] }
        },
        passed: true,
        ranAt: "2026-02-07T15:23:50Z"
      }
    ],
    evalRuns: [
      {
        id: "er-005-1",
        assignmentId: "asn-005",
        iteration: 1,
        perDimensionScores: [
          { dimension: "problem_clarity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "complexity_correctness", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any },
          { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any }
        ],
        compositeScore: 3.7,
        passedThresholds: false,
        thresholdsUsed: ACTIVE_THRESHOLDS,
        ranAt: "2026-02-07T15:10:00Z"
      },
      {
        id: "er-005-2",
        assignmentId: "asn-005",
        iteration: 2,
        perDimensionScores: [
          { dimension: "problem_clarity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "complexity_correctness", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any },
          { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any }
        ],
        compositeScore: 3.7,
        passedThresholds: false,
        thresholdsUsed: ACTIVE_THRESHOLDS,
        ranAt: "2026-02-07T15:18:30Z"
      },
      {
        id: "er-005-3",
        assignmentId: "asn-005",
        iteration: 3,
        perDimensionScores: [
          { dimension: "problem_clarity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "test_case_coverage", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "complexity_correctness", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any },
          { dimension: "concept_rubric_alignment", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "real_world_fidelity", medianScore: 4, individualRuns: [{ score: 4 }, { score: 4 }, { score: 4 }] as any },
          { dimension: "novelty", medianScore: 3, individualRuns: [{ score: 3 }, { score: 3 }, { score: 3 }] as any }
        ],
        compositeScore: 3.7,
        passedThresholds: false,
        thresholdsUsed: ACTIVE_THRESHOLDS,
        ranAt: "2026-02-07T15:24:11Z"
      }
    ],
    instructorReview: null
  },

  // ===== Example 6: FAILED hard check — concept containment violation =====
  {
    id: "asn-006",
    categoryId: "dsa",
    request: {
      categoryId: "dsa",
      classContextId: "ctx-arrays-and-hashing",
      targetConcepts: {
        primary: ["heaps", "priority_queue"],
        secondary: ["frequency_counting"],
        mustNotRequire: []
      },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 35, expectedConceptCount: 2, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      realWorldAnchor: { domain: "logs", avoidOverused: [] },
      corpusSliceIds: ["q-kth-largest"]
    },
    status: "failed",
    ...STANDARD_VERSIONS,
    createdBy: "user-instructor-1",
    createdAt: "2026-02-08T16:00:00Z",
    completedAt: "2026-02-08T16:03:42Z",
    finalOutput: null,
    refinementIterations: [],
    verificationRuns: [{
      id: "vr-006-1",
      assignmentId: "asn-006",
      iteration: 1,
      hardChecks: {
        schemaValid: true,
        conceptCoverage: { passed: true, missing: [] },
        conceptContainment: {
          passed: false,
          outOfScope: ["heaps", "priority_queue"]
        },
        conceptExclusion: { passed: true, violated: [] },
        difficultyInBand: { passed: true, details: "within band" },
        leakage: { passed: true, maxSimilarity: 0.34 },
        codeExecution: undefined
      },
      passed: false,
      ranAt: "2026-02-08T16:03:42Z"
    }],
    evalRuns: [],
    instructorReview: null
  }
];
```

This data illustrates the upstream issue the prototype must surface: the request asked for `heaps` and `priority_queue` as primary concepts, but the selected class context (`ctx-arrays-and-hashing`) does not teach them. The hard check correctly catches the mismatch before any LLM call to the generator. The UI should expose this clearly — including a hint that the instructor should either pick a different class context (such as `ctx-heaps-and-stacks`) or downgrade the request.

---

## 7. Prompt proposals (`promptProposals.ts`)

Two pending proposals from the auto-iterator.

```ts
import type { PromptProposal } from "../../types";

export const DSA_PROMPT_PROPOSALS: PromptProposal[] = [
  {
    id: "pp-001",
    basePromptId: "prompt-generation-v3",
    proposedBody: `[Same as generation v3, with the following diff applied:]

INSERT after constraint 7 in HARD CONSTRAINTS:
8. The problem.statement MUST specify the unit of every numeric quantity (e.g., "minutes", "bytes", "requests/second"). Stated numeric ranges without units fail this constraint.

INSERT in QUALITY EXPECTATIONS:
- When the scenario involves a measurement or rate, name the unit explicitly in the statement. Do not rely on the reader to infer.`,
    proposingAgent: "auto_iterator",
    reasoning: `Across the last 30 days, 12 of 47 generations failed problem_clarity below threshold. Of those, 9 had reviewer comments citing "unclear units" or "missing dimension on numeric quantity" (e.g., asn-002 needed refinement specifically because the window unit was ambiguous). Adding an explicit unit-naming requirement to the hard constraints addresses the root cause directly.

Gold-set re-evaluation with the proposed prompt: problem_clarity median rose from 4.0 to 4.6 across the 10 canonical entries. No other dimension regressed (changes within ±0.1).`,
    goldSetComparison: [
      { dimension: "problem_clarity", oldMedian: 4.0, newMedian: 4.6 },
      { dimension: "test_case_coverage", oldMedian: 4.2, newMedian: 4.2 },
      { dimension: "complexity_correctness", oldMedian: 4.8, newMedian: 4.8 },
      { dimension: "concept_rubric_alignment", oldMedian: 4.3, newMedian: 4.3 },
      { dimension: "real_world_fidelity", oldMedian: 4.0, newMedian: 4.1 },
      { dimension: "novelty", oldMedian: 3.7, newMedian: 3.7 }
    ],
    status: "pending",
    createdAt: "2026-02-09T08:00:00Z"
  },
  {
    id: "pp-002",
    basePromptId: "prompt-judge-novelty-v1",
    proposedBody: `[Same as novelty judge v1, with anchors revised:]

ANCHORS (revised):
- Score 5: Genuinely novel framing AND a non-canonical objective function. A learner who has memorized canonical interview problems cannot solve this by pattern-match on the problem statement; they must reason from concepts to solution.
- Score 3: Recognizable canonical problem with a cosmetic transformation (rename + new domain). The pattern is the same but the surface is new enough to require a moment of mapping.
- Score 1: Verbatim or near-verbatim canonical. A prepared learner solves from memory in under 2 minutes.

ADD to instructions:
"Verbatim or near-verbatim" means: (a) the underlying objective function is identical to a canonical problem AND (b) the inputs/outputs map directly without transformation. A new domain framing alone does not raise novelty above 3.`,
    proposingAgent: "auto_iterator",
    reasoning: `Reviewer feedback on asn-004 and three other approved-but-flagged assignments indicated the novelty dimension is currently too lenient — assignments that are "Two Sum but in a logistics domain" routinely score 4, where instructors would rate them 2-3. Tightening the anchors and clarifying what constitutes "verbatim" should bring judge scores closer to instructor judgments.

Gold-set re-evaluation: novelty median dropped from 3.7 to 3.2, which more accurately reflects instructor ratings (mean 3.3 across the canonical set). No regression on other dimensions.

This proposal will cause some currently-approved assignments to start failing the novelty threshold; that's the intended effect.`,
    goldSetComparison: [
      { dimension: "problem_clarity", oldMedian: 4.0, newMedian: 4.0 },
      { dimension: "test_case_coverage", oldMedian: 4.2, newMedian: 4.2 },
      { dimension: "complexity_correctness", oldMedian: 4.8, newMedian: 4.8 },
      { dimension: "concept_rubric_alignment", oldMedian: 4.3, newMedian: 4.3 },
      { dimension: "real_world_fidelity", oldMedian: 4.0, newMedian: 4.0 },
      { dimension: "novelty", oldMedian: 3.7, newMedian: 3.2 }
    ],
    status: "pending",
    createdAt: "2026-02-10T08:00:00Z"
  }
];
```

---

## 8. Concept proposals (`conceptProposals.ts`)

One pending concept proposal demonstrating the workflow.

```ts
import type { ConceptProposal } from "../../types";

export const DSA_CONCEPT_PROPOSALS: ConceptProposal[] = [
  {
    id: "cp-001",
    categoryId: "dsa",
    proposedBy: "user-instructor-1",
    proposed: {
      id: "segment_tree",
      categoryId: "dsa",
      canonicalName: "Segment Tree",
      aliases: ["range tree", "interval tree"],
      definition: "Balanced binary tree over an array supporting O(log n) range queries and point updates. Common for range-sum, range-min/max, and lazy-propagated range updates.",
      parentId: "trees",
      depthCriteria: {
        introduced: "Knows segment trees enable O(log n) range queries on arrays",
        applied: "Implements segment tree with build, point-update, and range-query operations",
        mastered: "Implements lazy propagation for range updates; reasons about memory and recursion depth"
      },
      status: "active"
    },
    rationale: "Three recent class contexts (modules 16, 17, 18) cover advanced range-query problems but the taxonomy currently lacks any way to tag segment-tree concepts. As a result, generations for advanced range-query assignments fall back to tagging 'arrays' + 'recursion' which is too coarse — assignments are being approved that should be flagged as conceptually out-of-scope for the class context. Adding this concept gives the concept-containment hard check the resolution it needs.",
    status: "pending",
    createdAt: "2026-02-11T09:30:00Z"
  }
];
```

---

## 9. Index (`index.ts`)

Single entry point that re-exports everything. The frontend imports from `@/lib/seed/dsa`.

```ts
export { DSA_CONCEPTS } from "./taxonomy";
export { DSA_CLASS_CONTEXTS } from "./classContexts";
export { DSA_CORPUS } from "./corpus";
export { DSA_PROMPTS } from "./prompts";
export { DSA_GOLD_SET } from "./goldSet";
export { DSA_EXAMPLE_ASSIGNMENTS, type SeededAssignment } from "./assignments";
export { DSA_PROMPT_PROPOSALS } from "./promptProposals";
export { DSA_CONCEPT_PROPOSALS } from "./conceptProposals";

// Aggregate object for convenience
import { DSA_CONCEPTS } from "./taxonomy";
import { DSA_CLASS_CONTEXTS } from "./classContexts";
import { DSA_CORPUS } from "./corpus";
import { DSA_PROMPTS } from "./prompts";
import { DSA_GOLD_SET } from "./goldSet";
import { DSA_EXAMPLE_ASSIGNMENTS } from "./assignments";
import { DSA_PROMPT_PROPOSALS } from "./promptProposals";
import { DSA_CONCEPT_PROPOSALS } from "./conceptProposals";

export const DSA_SEED = {
  category: {
    id: "dsa" as const,
    name: "Data Structures and Algorithms",
    verificationLayer: "code_execution" as const,
    defaultDifficultyTiers: ["easy", "medium", "hard"],
    createdAt: "2026-01-01T00:00:00Z"
  },
  concepts: DSA_CONCEPTS,
  classContexts: DSA_CLASS_CONTEXTS,
  corpus: DSA_CORPUS,
  prompts: DSA_PROMPTS,
  goldSet: DSA_GOLD_SET,
  exampleAssignments: DSA_EXAMPLE_ASSIGNMENTS,
  promptProposals: DSA_PROMPT_PROPOSALS,
  conceptProposals: DSA_CONCEPT_PROPOSALS,
  taxonomyVersion: 1,
  goldSetVersion: 1
};
```

---

## 10. How the prototype consumes this seed

The frontend imports `DSA_SEED` once at app boot and stores it in a React Context (or Zustand store). All page components read from this store. User-created additions (new gold-set entries, new concept proposals authored during the session) are merged into the store and additionally persisted to localStorage under the key `"dsa-seed-overlay"`.

On app boot:
```ts
const overlay = JSON.parse(localStorage.getItem("dsa-seed-overlay") ?? "{}");
const seed = mergeWithOverlay(DSA_SEED, overlay);
```

The "Reset prototype data" button in the dashboard footer (per Document A section 9) clears the overlay and reloads the page, returning the prototype to its initial state.

For the full-stack prototype (Document B), `/scripts/seed.py` translates the same TypeScript data structures to SQLAlchemy models. The translation is mechanical — the seed script reads the TypeScript-style data (or a JSON dump of it) and creates corresponding database rows. The taxonomy_version and gold_set_version are both set to 1 after the seed completes.

---

## 11. Notes on the gold-set version threshold

With 10 canonical gold-set entries this seed already crosses the bootstrap threshold (≥ 10 canonical entries), so the eval thresholds switch to gold-set-derived from the first run. The thresholds used by the example assignments above (`ACTIVE_THRESHOLDS`) were computed as approximately the 25th percentile of per-dimension scores across the 10 canonical entries, rounded down to half-integers for stability. If the agent re-derives thresholds programmatically during seed bootstrap, the numbers should be close but may shift by 0.1–0.3.

End of Document C.
