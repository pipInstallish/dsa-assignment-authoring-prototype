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
