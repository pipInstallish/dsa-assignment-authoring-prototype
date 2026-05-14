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
  {
    id: "divide_and_conquer",
    categoryId: "dsa",
    canonicalName: "Divide and Conquer",
    aliases: [],
    definition: "Algorithmic paradigm that recursively breaks problems into smaller subproblems, solves them independently, and combines results.",
    parentId: "recursion",
    depthCriteria: {
      introduced: "Understands split-solve-combine paradigm",
      applied: "Implements merge sort and binary search recursively",
      mastered: "Designs novel divide-and-conquer solutions with correct recurrence analysis"
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
