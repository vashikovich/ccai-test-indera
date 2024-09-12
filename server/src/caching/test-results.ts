const cache: Record<string, any> = {};

export const setTestSuiteResult = (testSuiteId: string, results: any) => {
  cache[testSuiteId] = results;
};

export const getTestSuiteResult = (testSuiteId: string) => {
  return cache[testSuiteId];
};
