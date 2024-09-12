import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import styles from "./HomePage.module.css";
import { fetchTestResults, postStartTest } from "../lib/api";
import { TestResult } from "../lib/definitions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function HomePage() {
  const [testResults, setTestResults] = useState<Record<
    string,
    TestResult
  > | null>(null);

  const poller = useRef<NodeJS.Timer>();
  const isTestRunning = Boolean(poller.current);

  const startTest = async () => {
    const { id, results } = await postStartTest();
    setTestResults(results);

    poller.current = setInterval(async () => {
      const results = await fetchTestResults(id);
      setTestResults(results);
      if (Object.values(results).every((r) => r.status !== "RUNNING")) {
        clearInterval(poller.current);
      }
    }, 1000);
  };

  return (
    <Container className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4">Video Converter Website</Typography>
        <Button
          variant="contained"
          onClick={startTest}
          disabled={isTestRunning}
        >
          Start Test
        </Button>
      </Box>
      <Box>
        {testResults &&
          Object.keys(testResults).map((testName) => {
            const result = testResults[testName];
            return (
              <Accordion className={styles.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box className={styles.accordionSummary}>
                    <Typography>{testName}</Typography>{" "}
                    <Typography
                      className={`${styles.statusText} ${
                        styles[`statusText_${result.status}`]
                      }`}
                    >
                      {result.status}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className={styles.accordionDetails}>
                    <Box className={styles.statusDetails}>
                      <Typography className={styles.detailsTitle}>
                        Status
                      </Typography>
                      <Typography
                        className={`${styles.statusText} ${
                          styles[`statusText_${result.status}`]
                        }`}
                      >
                        {result.status}
                      </Typography>
                    </Box>

                    <Box className={styles.textDetails}>
                      <Typography className={styles.detailsTitle}>
                        Description
                      </Typography>
                      <Typography className={styles.desc}>
                        {result.resultDesc}
                      </Typography>
                    </Box>

                    <Box className={styles.textDetails}>
                      <Typography className={styles.detailsTitle}>
                        Steps
                      </Typography>
                      <List className={styles.list}>
                        {result.steps.map((step) => (
                          <ListItem className={styles.listItem}>
                            <Typography className={styles.desc}>
                              {step}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    </Container>
  );
}
