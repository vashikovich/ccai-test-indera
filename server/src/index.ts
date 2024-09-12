import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getVideoConverterTestSuite } from "./test-suites/video-converter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const results = await getVideoConverterTestSuite().run();
  res.send(results);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
