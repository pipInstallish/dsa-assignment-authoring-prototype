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
