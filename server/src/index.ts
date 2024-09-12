import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import testSuite from "./test-suites/video-converter/test-suite";
import { getTestSuiteResult } from "./caching/test-results";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
