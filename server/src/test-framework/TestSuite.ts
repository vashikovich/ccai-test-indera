import { TestCase } from "./TestCase";

export class TestSuite {
  name: string;
  testCases: TestCase[];
  results: Record<
    string,
    { status: string; steps: string[]; resultDesc: string }
  >;

  constructor(name: string, testCases: TestCase[]) {
    this.name = name;
    this.testCases = testCases;
    this.results = {};
  }

  async run() {
    await Promise.all(
      this.testCases.map(async (test) => {
        const { passed, steps } = await test.run();
        this.results[test.name] = {
          status: passed ? "PASSED" : "FAILED",
          steps,
          resultDesc: "AAA",
        };
      })
    );

    return this.results;
  }
}
