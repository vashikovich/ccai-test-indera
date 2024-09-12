import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import styles from "./TestResultAccordion.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TestResult } from "../lib/definitions";

type Props = {
  result: TestResult;
  testName: string;
};

export default function TestResultAccordion({ result, testName }: Props) {
  return (
    <Accordion className={styles.accordion} key={testName}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box className={styles.accordionSummary}>
          <p className={styles.detailsTitle}>{testName}</p>{" "}
          <p
            className={`${styles.statusText} ${
              styles[`statusText_${result.status}`]
            }`}
          >
            {result.status}
            {result.status === "RUNNING" ? (
              <CircularProgress size={15} sx={{ mx: 1 }} />
            ) : (
              ""
            )}
          </p>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box className={styles.accordionDetails}>
          <Box className={styles.statusDetails}>
            <p className={styles.detailsTitle}>Status</p>
            <p
              className={`${styles.statusText} ${
                styles[`statusText_${result.status}`]
              }`}
            >
              {result.status}
            </p>
          </Box>

          <Box className={styles.textDetails}>
            <p className={styles.detailsTitle}>Description</p>
            <p className={styles.desc}>{result.resultDesc}</p>
          </Box>

          <Box className={styles.textDetails}>
            <p className={styles.detailsTitle}>Steps</p>
            <List className={styles.list}>
              {result.steps.map((step, i) => (
                <ListItem className={styles.listItem} key={step}>
                  <p
                    className={`${styles.desc} ${
                      result.status === "FAILED" &&
                      i === result.steps.length - 1
                        ? styles.failedStep
                        : ""
                    }`}
                  >
                    {step}
                  </p>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
