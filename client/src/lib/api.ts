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
): Promise<{ name: string; results: Record<string, TestResult> }> => {
  const response = await fetch(`${baseUrl}/test-suite/check/${testId}`);
  return await response.json();
};

export const fetchResultsCsv = async (testId: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/test-suite/csv/${testId}`);
  const blob = await response.blob();
  var fileName = response.headers
    .get("content-disposition")
    ?.split("filename=")[1]
    .split(";")[0];
  console.log(fileName);
  const file = new File([blob], fileName ?? "file");
  const fileUrl = window.URL.createObjectURL(file);
  window.location.assign(fileUrl);
};
