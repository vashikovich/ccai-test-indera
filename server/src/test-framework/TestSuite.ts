import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { TestCase } from "./TestCase";
import { v4 as uuid } from "uuid";
import { setTestSuiteResult } from "../caching/test-results";

export type Result = {
  status: "RUNNING" | "PASSED" | "FAILED";
  steps: string[];
  resultDesc: string;
};

export class TestSuite {
  name: string;
  id: string;
  tests: TestCase[];
  genModel: GenerativeModel;

  public results: Record<string, Result>;

  constructor(name: string, tests: TestCase[]) {
    this.name = name;
    this.id = uuid();
    this.tests = tests;
    this.results = {};

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    this.genModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  get testNames() {
    return this.tests.map((test) => test.name);
  }

  async generateResultDesc(
    testCaseName: string,
    status: string,
    steps: string[],
    failReason: unknown
  ) {
    const prompt = generateResultPrompt(
      testCaseName,
      status,
      steps,
      failReason
    );

    const result = await this.genModel.generateContent(prompt);
    return result.response.text();
  }

  updateResults(testName: string, results: Result) {
    this.results[testName] = results;
    setTestSuiteResult(this.id, this.name, this.results);
  }

  run() {
    Promise.all(
      this.tests.map(async (test) => {
        this.updateResults(test.name, {
          status: "RUNNING",
          steps: [],
          resultDesc: "",
        });

        const { passed, steps, failReason } = await test.run();
        const status = passed ? "PASSED" : "FAILED";

        this.updateResults(test.name, {
          status,
          steps,
          resultDesc: await this.generateResultDesc(
            test.name,
            status,
            steps,
            failReason
          ),
        });
      })
    );

    return { id: this.id, results: this.results };
  }
}

const generateResultPrompt = (
  testCaseName: string,
  status: string,
  steps: string[],
  failReason: unknown
) => {
  return `
"I have just run a website test case using a web driver like Playwright. The test case checks that "${testCaseName}". Here are the results:

Test case status: ${status}
Steps taken during the test: ${steps.join(", ")}
${failReason ? `Any errors or issues encountered: ${failReason}` : ""}
Environment: Chromium
Based on this information, please write a single clear and concise paragraph summarizing the test case results, the observed behavior, and any discrepancies or issues that need to be addressed."
`;
};
