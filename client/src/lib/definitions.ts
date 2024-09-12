export type TestResult = {
  status: "RUNNING" | "PASSED" | "FAILED";
  steps: string[];
  resultDesc: string;
};
