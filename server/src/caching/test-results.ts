import { Result } from "../test-framework/TestSuite";

const cache: Record<string, any> = {};

export const setTestSuiteResult = (
  testSuiteId: string,
  testSuiteName: string,
  results: any
) => {
  cache[testSuiteId] = { name: testSuiteName, results };
};

export const getTestSuiteResult = (
  testSuiteId: string
): { name: string; results: Record<string, Result> } => {
  return cache[testSuiteId];
};
