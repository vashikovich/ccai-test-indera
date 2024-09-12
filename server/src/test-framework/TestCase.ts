import { chromium, devices, Page } from "playwright";

type TestFunction = (
  page: Page,
  steps: string[],
  assertTrue: (value: boolean) => void
) => void;

export class TestCase {
  public name: string;
  testFunc: TestFunction;

  constructor(name: string, testFunc: TestFunction) {
    this.name = name;
    this.testFunc = testFunc;
  }

  async run() {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices["Desktop Chrome"]);
    const page = await context.newPage();

    const steps: string[] = [];
    const assertTrue = (value: boolean) => {
      if (!value) {
        throw "Errdawdwaor";
      }
    };
    let isFailed = false;
    let failReason: unknown;

    try {
      await this.testFunc(page, steps, assertTrue);
    } catch (error) {
      isFailed = true;
      failReason = error;
    } finally {
      await context.close();
      await browser.close();

      return { passed: !isFailed, steps, failReason };
    }
  }
}
