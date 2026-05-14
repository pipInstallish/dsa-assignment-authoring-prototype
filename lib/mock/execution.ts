import type { VerificationRun } from "../types";

// Returns mock code execution results for a given assignment
export function getMockCodeExecutionResult(assignmentId: string): VerificationRun["hardChecks"]["codeExecution"] {
  // Flow 4 (assign-003) simulates a code execution failure
  if (assignmentId === "assign-003" || assignmentId.includes("tree_traversal")) {
    return {
      passed: false,
      results: [
        { testCaseId: "tc1", passed: true, runtimeMs: 42 },
        { testCaseId: "tc2", passed: true, runtimeMs: 38 },
        { testCaseId: "tc3", passed: false, runtimeMs: 45, output: "None", error: "AttributeError: 'NoneType' object has no attribute 'val' — stack overflow on null node in recursion" },
        { testCaseId: "tc4", passed: true, runtimeMs: 41 },
        { testCaseId: "tc5", passed: true, runtimeMs: 39 },
        { testCaseId: "tc6", passed: false, runtimeMs: 2001, error: "Time Limit Exceeded — recursion depth exceeded for n=100,000 skewed tree" }
      ]
    };
  }

  // Default: all pass
  return {
    passed: true,
    results: [
      { testCaseId: "tc1", passed: true, runtimeMs: 42 },
      { testCaseId: "tc2", passed: true, runtimeMs: 38 },
      { testCaseId: "tc3", passed: true, runtimeMs: 41 },
      { testCaseId: "tc4", passed: true, runtimeMs: 39 },
      { testCaseId: "tc5", passed: true, runtimeMs: 44 },
      { testCaseId: "tc6", passed: true, runtimeMs: 156 }
    ]
  };
}
