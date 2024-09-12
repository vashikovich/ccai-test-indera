import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import testSuite from "./test-suites/video-converter/test-suite";
import { getTestSuiteResult } from "./caching/test-results";
import { generateResultsCsv } from "./test-framework/csvExport";
import fs from "fs/promises";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get("/test-suite/check/:id", async (req: Request, res: Response) => {
  res.send(getTestSuiteResult(req.params.id));
});

app.post("/test-suite/run", async (req: Request, res: Response) => {
  const info = testSuite().run();
  res.send(info);
});

app.get("/test-suite/csv/:id", async (req: Request, res: Response) => {
  const testResults = getTestSuiteResult(req.params.id);
  if (!testResults) res.status(403).send();

  const csvFile = await generateResultsCsv(
    req.params.id,
    testResults.name,
    testResults.results
  );
  res
    .header("Access-Control-Expose-Headers", "Content-Disposition")
    .download(csvFile, csvFile, () => {
      fs.unlink(csvFile);
    });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
