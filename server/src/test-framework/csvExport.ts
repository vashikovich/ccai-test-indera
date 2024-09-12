import { Result } from "./TestSuite";
import fs from "fs/promises";

const header = ["Test Case", "Status", "Steps", "Description"].join("|");

export const generateResultsCsv = async (
  testSuiteId: string,
  testSuiteName: string,
  results: Record<string, Result>
) => {
  const data = Object.keys(results).map((name) =>
    [
      name,
      results[name].status,
      results[name].steps.join(", "),
      results[name].resultDesc.trim(),
    ].join("|")
  );
  const content = [header, ...data].join("\n");

  const filename = `${testSuiteName} - ${testSuiteId}.csv`;

  await fs.writeFile(filename, content);

  return filename;
};
