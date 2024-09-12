import { TestResult } from "./definitions";

const baseUrl = "http://localhost:3001";

export const postStartTest = async (): Promise<{
  id: string;
  results: Record<string, TestResult>;
}> => {
  const response = await fetch(`${baseUrl}/test-suite/run`, { method: "POST" });
  return await response.json();
};

export const fetchTestResults = async (
  testId: string
): Promise<Record<string, TestResult>> => {
  const response = await fetch(`${baseUrl}/test-suite/check/${testId}`);
  return await response.json();
};
