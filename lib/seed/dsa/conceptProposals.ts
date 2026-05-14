import type { ConceptProposal } from "../../types";

export const DSA_CONCEPT_PROPOSALS: ConceptProposal[] = [
  {
    id: "concept-proposal-001",
    proposedBy: "Sarah Chen",
    categoryId: "dsa",
    proposed: {
      id: "segment_tree",
      categoryId: "dsa",
      canonicalName: "Segment Tree",
      aliases: ["range tree", "interval tree"],
      definition: "A tree data structure for storing intervals or segments, enabling efficient range queries and point updates in O(log n).",
      parentId: "trees",
      depthCriteria: {
        introduced: "Understands the concept and when range queries are needed",
        applied: "Implements a basic segment tree for range sum or range min queries",
        mastered: "Handles lazy propagation for range updates; extends to 2D or persistent variants"
      },
      status: "active",
      taxonomyVersion: 1
    },
    rationale: "Several recently generated assignments for advanced learners require range queries that are better solved with segment trees. The current taxonomy has no concept for this, causing the system to tag these with just 'arrays' which is misleading. Adding segment_tree as a child of trees would improve concept coverage accuracy for advanced modules.",
    status: "pending"
  }
];
