"use client";

import type { GoldSetEntry, ConceptProposal, ClassContext, InstructorReview, AssignmentRecord } from "../types";

const KEYS = {
  GOLD_SET_ENTRIES: "app:gold_set_entries",
  CONCEPT_PROPOSALS: "app:concept_proposals",
  CLASS_CONTEXTS: "app:class_contexts",
  INSTRUCTOR_REVIEWS: "app:instructor_reviews",
  APPROVED_ASSIGNMENTS: "app:approved_assignments",
  PROMPT_PROPOSALS: "app:prompt_proposals",
} as const;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage might be full
  }
}

// Gold set entries (user-created)
export function getUserGoldSetEntries(): GoldSetEntry[] {
  return safeGet<GoldSetEntry[]>(KEYS.GOLD_SET_ENTRIES, []);
}

export function addUserGoldSetEntry(entry: GoldSetEntry): void {
  const existing = getUserGoldSetEntries();
  safeSet(KEYS.GOLD_SET_ENTRIES, [...existing, entry]);
}

export function updateUserGoldSetEntry(id: string, updates: Partial<GoldSetEntry>): void {
  const existing = getUserGoldSetEntries();
  safeSet(KEYS.GOLD_SET_ENTRIES, existing.map(e => e.id === id ? { ...e, ...updates } : e));
}

// Concept proposals (user-created)
export function getUserConceptProposals(): ConceptProposal[] {
  return safeGet<ConceptProposal[]>(KEYS.CONCEPT_PROPOSALS, []);
}

export function addUserConceptProposal(proposal: ConceptProposal): void {
  const existing = getUserConceptProposals();
  safeSet(KEYS.CONCEPT_PROPOSALS, [...existing, proposal]);
}

export function updateConceptProposalStatus(id: string, status: ConceptProposal["status"]): void {
  const existing = getUserConceptProposals();
  safeSet(KEYS.CONCEPT_PROPOSALS, existing.map(p => p.id === id ? { ...p, status } : p));
}

// Class contexts (user-created)
export function getUserClassContexts(): ClassContext[] {
  return safeGet<ClassContext[]>(KEYS.CLASS_CONTEXTS, []);
}

export function addUserClassContext(ctx: ClassContext): void {
  const existing = getUserClassContexts();
  safeSet(KEYS.CLASS_CONTEXTS, [...existing, ctx]);
}

// Instructor reviews (user-created)
export function getUserInstructorReviews(): InstructorReview[] {
  return safeGet<InstructorReview[]>(KEYS.INSTRUCTOR_REVIEWS, []);
}

export function addInstructorReview(review: InstructorReview): void {
  const existing = getUserInstructorReviews();
  safeSet(KEYS.INSTRUCTOR_REVIEWS, [...existing, review]);
}

// Approved assignments (user-approved from generate flow)
export function getUserApprovedAssignments(): AssignmentRecord[] {
  return safeGet<AssignmentRecord[]>(KEYS.APPROVED_ASSIGNMENTS, []);
}

export function addUserApprovedAssignment(record: AssignmentRecord): void {
  const existing = getUserApprovedAssignments();
  safeSet(KEYS.APPROVED_ASSIGNMENTS, [...existing, record]);
}

// Prompt proposal status overrides
export function getPromptProposalStatuses(): Record<string, "pending" | "approved" | "rejected"> {
  return safeGet<Record<string, "pending" | "approved" | "rejected">>(KEYS.PROMPT_PROPOSALS, {});
}

export function setPromptProposalStatus(id: string, status: "pending" | "approved" | "rejected"): void {
  const existing = getPromptProposalStatuses();
  safeSet(KEYS.PROMPT_PROPOSALS, { ...existing, [id]: status });
}

// Reset all user data
export function resetPrototypeData(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}
