import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { TestCase } from "./TestCase";

export class TestSuite {
  name: string;
  testCases: TestCase[];
  results: Record<
    string,
    { status: string; steps: string[]; resultDesc: string }
  >;
  genModel: GenerativeModel;

  constructor(name: string, testCases: TestCase[]) {
    this.name = name;
    this.testCases = testCases;
    this.results = {};

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    this.genModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

  async run() {
    await Promise.all(
      this.testCases.map(async (test) => {
        const { passed, steps, failReason } = await test.run();
        const status = passed ? "PASSED" : "FAILED";
        this.results[test.name] = {
          status,
          steps,
          resultDesc: await this.generateResultDesc(
            test.name,
            status,
            steps,
            failReason
          ),
        };
      })
    );

    return this.results;
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
