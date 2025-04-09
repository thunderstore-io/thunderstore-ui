import { ZodError } from "zod";

export const formatErrorMessage = (errors: ZodError) => {
  const issues = errors.issues.map(
    (issue) => `  ${issue.path.join(".")}: ${issue.message}`
  );

  issues.unshift(
    `Invalid data received from backend (${errors.issues.length}):`
  );

  return issues.join("\n");
};
