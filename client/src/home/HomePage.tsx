import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import styles from "./HomePage.module.css";
import { fetchResultsCsv, fetchTestResults, postStartTest } from "../lib/api";
import { TestResult } from "../lib/definitions";

import TestResultAccordion from "./TestResultAccordion";

export default function HomePage() {
  const [testId, setTestId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<
    string,
    TestResult
  > | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const poller = useRef<NodeJS.Timer>();

  const startTest = async () => {
    const { id, results } = await postStartTest();
    setTestId(id);
    setTestResults(results);
    setIsTestRunning(true);

    poller.current = setInterval(async () => {
      const { results } = await fetchTestResults(id);
      setTestResults(results);
      if (Object.values(results).every((r) => r.status !== "RUNNING")) {
        clearInterval(poller.current);
        setIsTestRunning(false);
      }
    }, 1000);
  };

  const downloadCsv = async () => {
    if (testId) await fetchResultsCsv(testId);
  };

  return (
    <Container className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4">Video Converter Website</Typography>
        <Box className={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={startTest}
            disabled={isTestRunning}
          >
            {isTestRunning ? "Running" : "Start Test"}
          </Button>
          {!isTestRunning && testResults && (
            <Button variant="contained" color="success" onClick={downloadCsv}>
              Download CSV
            </Button>
          )}
        </Box>
      </Box>

      <Box>
        {testResults &&
          Object.keys(testResults).map((testName) => {
            const result = testResults[testName];
            return (
              <TestResultAccordion
                result={result}
                testName={testName}
                key={testName}
              />
            );
          })}
      </Box>
    </Container>
  );
}
